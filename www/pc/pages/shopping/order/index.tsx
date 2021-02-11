import * as React from 'react';
import Router, {useRouter} from "next/router";
import ShoppingApi from '../../../src/apis/ShoppingApi';
import PaymentApi from '../../../src/apis/PaymentApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {RootState} from '../../../src/reducers';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import OGMetaHead from "../../../components/OGMetaHead";
import StaticCartItem from '../../../components/shopping/StaticCartItem';
import Input from '../../../components/inputs/Input';
import Radio from '../../../components/UI/Radio/Radio';
import Loading from '../../../components/common/Loading';
import {CartTable, CommonWrapper, OrderFormDiv, OrderReceiptDiv, OrderPartSection} from '../../../components/shopping/style/order';
import {isEmpty, isArray} from 'lodash';
import {isPeriodDate} from '../../../src/lib/date';
import {numberWithCommas} from '../../../src/lib/numbers';
import {IMPPayment} from '../../../src/lib/payment';
import CheckBox from '../../../components/UI/Checkbox1/CheckBox';
import {SHINHAN_DISCOUNT_PERCENTAGE, SHINHAN_PG_SERVER_DOMAIN} from '../../../src/constants/shopping';
import A from '../../../components/UI/A';
import {staticUrl} from '../../../src/constants/env';
import {VALIDATE_REGEX} from '../../../src/constants/validates';
import {pushPopup} from '../../../src/reducers/popup';
import ApolloAddressPopup from '../../../components/layout/popup/ApolloAddressPopup';
import {useQuery} from '@apollo/react-hooks';
import {MY_ADDRESS} from '../../../src/gqls/shopping';

const FORM_VALIDATES = {
  name: {
    title: '수신인 이름',
    required: true,
  },
  phone: {
    title: '수신인 연락처',
    required: true,
    regex: VALIDATE_REGEX.VALIDATE_PHONE
  },
  zonecode: {
    title: '주소',
    required: true
  },
  road_address: {
    title: '주소',
    required: false,
    callback: (value, _, data) => {
      if(!value && !data.jibun_address) {
        return [false, '주소를 입력해주세요.'];
      }
      return [true];
    }
  },
  jibun_address: {
    title: '주소',
    required: false,
    callback: (value, _, data) => {
      if(!value && !data.road_address) {
        return [false, '주소를 입력해주세요.'];
      }
      return [true];
    }
  },
  address_detail: {
    title: '상세주소',
    required: false
  },
  request: {
    title: '배송 메세지',
    required: false
  },
  pay_method: {
    title: '결제수단',
    required: true
  },
  confirm_agree: {
    title: '주문 상품정보 동의',
    type: 'checkbox',
    required: true,
    msg: '주문 상품정보 동의 사항에 동의해주세요.'
  }
};

const isFormValidate = (formData) => {
  const validateArray = Object.keys(FORM_VALIDATES);
  
  for(let i = 0, length = validateArray.length; i < length; i++) {
    const key = validateArray[i];
    const field  = FORM_VALIDATES[key];
  
    if(field.required) {
      const value = formData[key];

      if(typeof value === 'boolean' && value === true) {
        return [true, ''];
      }
      
      if(isEmpty(value)) {
        return [
          false,
          field.msg || `${field.title || key}을(를) ${!!field.type && (field.type === 'radio' || field.type === 'checkbox') ? '선택' : '입력'}해주세요`
        ];
      }
    }
    if(typeof field.callback === 'function') {
      const callbackResult = field.callback(formData[key], key, formData);
      if(isArray(callbackResult)) {
        const [result, msg] = callbackResult;
        if(typeof result === 'boolean' && typeof msg === 'string') {
          return callbackResult;
        }
      }
    }
    if(isArray(field.regex)) {
      const [reg, failMsg] = field.regex;
      if(reg.test(formData[key]) === false) {
        return [false, failMsg || ''];
      }
    }
  }

  return [true, ''];
};

const PAYMENT_NEXT_PAGE = '/payment';

const catchPaymentShinhan = (result: boolean) => {
  if(result) {
    paymentSuccessFn();
  } else {
    alert('결제에 실패하였습니다.\n관리자에게 문의하시기 바랍니다.');
  }
};

const paymentSuccessFn = () => {
  alert('정상적으로 결제 되었습니다.'); 
  Router.replace(PAYMENT_NEXT_PAGE);
}



const Order = () => {
  // Api
  const {
    shoppingApi,
    paymentApi
  } = useCallAccessFunc(access => ({
    shoppingApi: new ShoppingApi(access),
    paymentApi: new PaymentApi(access)
  }));

  // Redux
  const dispatch = useDispatch();
  const me = useSelector(
    ({orm, system: {session: {id}}}: RootState) => pickUserSelector(id)(orm),
    shallowEqual
  );

  // Router
  const router = useRouter();
  let { 'id[]': cartIds } = router.query;
  cartIds = Array.isArray(cartIds) ? cartIds : [cartIds];
  
  // State, Ref
  const formRef = React.useRef(null);
  const [carts, setCarts] = React.useState([]);
  const [pending, setPending] = React.useState(true);
  const [merchantUid, setMerchantUid] = React.useState('')
  const [form, setForm] = React.useState({
    name: '',
    phone: '',
    zonecode: '',
    road_address: '',
    jibun_address: '',
    address_detail: '',
    can_receive_on_weekend: false,
    request: '',
    pay_method: '',
    confirm_agree: false,
  });

  const {
    name,
    phone,
    zonecode,
    road_address,
    jibun_address,
    address_detail,
    can_receive_on_weekend,
    request,
    pay_method,
    confirm_agree
  } = form;

  let paymentName = carts[0] ? carts[0].story.title : '';
  if(carts.length > 1) {
    paymentName += `외 ${carts.length - 1}건`;
  }

  const {
    data: {my_addresses} = {my_addresses}
  } = useQuery(MY_ADDRESS, {
    variables: {
      limit: 1,
      offset: 0,
    }
  });

  React.useEffect(() => {
    shoppingApi.carts({params: { id: cartIds }})
      .then(({ data: { results } }) => {
        setCarts(results);
        setPending(false);
      })
      .catch(() => {
        setPending(false);
      });
  }, []);

  React.useEffect(() => {
    if(my_addresses) {
      const {
        nodes
      } = my_addresses;

      if(!isEmpty(nodes)) {
        setForm(curr => ({
          ...curr,
          ...nodes[0]
        }));
      }
    }
  }, [my_addresses])

  const {totalCnt, totalPrice} = React.useMemo(() => {
    return carts.reduce(({totalCnt, totalPrice}, {id, product, quantity}) => {
      const {
        price,
        sale_start_at,
        sale_end_at,
        sale_price
      } = product;
      
      return {
        totalCnt: totalCnt + quantity,
        totalPrice: totalPrice + ((isPeriodDate(sale_start_at, sale_end_at) && sale_price ? sale_price : price) * quantity)
      }
    }, {
      totalCnt: 0,
      totalPrice: 0
    });
  }, [carts]);

  const totalDeliveryFee = React.useMemo(() => {
    return carts.reduce((prevValue, {story: {extension}}) => {
      if(!extension) return prevValue;

      const {
        delivery_fee = 0,
        delivery_fee_free_over = 0
      } = extension;
      
      if(totalPrice < delivery_fee_free_over) return prevValue + delivery_fee;
      return prevValue;
    }, 0);
  }, [totalPrice]);

  const discount = React.useMemo(() => {
    let totalDiscount = 0;
    if(pay_method === 'shinhan') {
      totalDiscount += Math.ceil(totalPrice * SHINHAN_DISCOUNT_PERCENTAGE);
    };

    return totalDiscount;
  }, [totalPrice, pay_method]);

  const postShinhanForm = () => {
    window.open(`${SHINHAN_PG_SERVER_DOMAIN}/payment/`, 'payment_popup', 'height=400,width=640,location=no,status=yes,dependent=no,scrollbars=yes,resizable=yes');
    formRef.current.submit();
  };

  const submit = React.useCallback(() => {
    const [isValidated, msg] = isFormValidate(form);

    if(!isValidated) {
      return alert(msg);
    }
    shoppingApi.payment(cartIds, {
      name,
      phone,
      zonecode,
      road_address,
      jibun_address,
      address_detail,
      can_receive_on_weekend,
      request
    })
      .then(({data: {result: {merchant_uid}}}) => {
        if(pay_method === 'card') {
          IMPPayment({
            merchant_uid,
            pay_method,
            name: paymentName,
            amount: totalPrice + totalDeliveryFee - (pay_method === 'card' ? discount : 0),
            buyer_name: me.name || name,
            buyer_tel: me.phone || phone,
            buyer_email: me.email || '',
            onSuccess: ({status, imp_uid, merchant_uid}) => {
              paymentApi.iamport({status, imp_uid, merchant_uid})
                .then(({status}) => {
                  if (Math.floor(status / 100) !== 4) {
                    paymentSuccessFn();
                  }
                })
            }
          });
        } else {
          setMerchantUid(merchant_uid);
          postShinhanForm();
        }
      })
      .catch(() => {
        alert('결제에 실패하였습니다.\n관리자에게 문의하시기 바랍니다.');
      });

  }, [form]);

  React.useEffect(() => {
    const postMessageListener = ({origin, data}) => {
      if(origin === SHINHAN_PG_SERVER_DOMAIN) {
        catchPaymentShinhan(data || false);
      }
    }

    window.addEventListener('message', postMessageListener);

    return () => window.removeEventListener('message', postMessageListener);
  }, []);

  return (
    <CommonWrapper>
      <OGMetaHead title="주문/결제"/>
      <header>
        <h2>주문/결제</h2>
        <ol>
          <li>
            <em>01</em>
            장바구니
          </li>
          <li className="active">
            <em>02</em>
            주문/결제
          </li>
          <li>
            <em>03</em>
            주문 완료
          </li>
        </ol>
      </header>
      <div>
        {pending ? (
          <Loading/>
        ) : (
          <>
            <section>
              <CartTable>
                <thead>
                <tr>
                  <th>이미지</th>
                  <th>상품 정보</th>
                  <th>수량</th>
                  <th>상품 가격</th>
                  <th>총 상품 금액</th>
                  <th>배송비</th>
                </tr>
                </thead>
                <tbody>
                {carts.map(({ 
                  story: { id: storyId, extension, images, ...story},
                  product,
                  ...props
                }) => {
                  return (
                    <StaticCartItem
                      key={storyId}
                      storyId={storyId}
                      thumbnail={images ? (images[0] || {}).image : ''}
                      {...story}
                      {...extension}
                      {...product}
                      {...props}
                    />
                  )
                })}
                </tbody>
              </CartTable>
              <div className="total-price">
                <ul>
                  <li>
                    <p>
                      총 상품가격
                      <span className="price">{numberWithCommas(totalPrice)}</span>
                      원
                    </p>
                  </li>
                  <li>
                    <p className="sign">+</p>
                  </li>
                  <li>
                    <p>
                      총 배송비
                      <span className="price">{numberWithCommas(totalDeliveryFee)}</span>
                      원
                    </p>
                  </li>
                  <li>
                    <p className="sign">=</p>
                  </li>
                  <li>
                    <p>
                      총 주문 금액
                      <span className="price red">{numberWithCommas(totalPrice + totalDeliveryFee)}</span>
                      원
                    </p>
                  </li>
                </ul>
              </div>
            </section>
            <section>
              <header>
                <h3>배송지 입력</h3>
                <button 
                  type="button"
                  onClick={() => {
                    dispatch(pushPopup(ApolloAddressPopup, {
                      onSelect: response => {
                        setForm(curr => ({
                          ...curr,
                          ...response
                        }));
                      }
                    }));
                  }}
                >
                  최근 배송지 목록
                </button>
              </header>
              <OrderFormDiv>
                <dl>
                  <dt className="required">
                    수신인 이름
                  </dt>
                  <dd>
                    <Input
                      value={name}
                      placeholder=""
                      onChange={({target: {value}}) => {
                        setForm(curr => ({
                          ...curr,
                          name: value
                        }))
                      }}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt className="required">
                    수신인 연락처
                  </dt>
                  <dd>
                    <Input
                      value={phone}
                      maxLength={11}
                      placeholder="숫자만 입력해주세요."
                      onChange={({target: {value}}) => {
                        if(!value || /^[0-9]+$/g.test(value)) {
                          setForm(curr => ({
                            ...curr,
                            phone: value
                          }))
                        }
                      }}
                    />
                  </dd>
                </dl>
                <dl>
                  <dt className="required">
                    주소
                  </dt>
                  <dd>
                    <div className="group">
                      <div className="item hypen">
                        <Input
                          className="zipcode"
                          value={zonecode}
                          placeholder=""
                          readOnly
                        />
                      </div>
                      <div className="item hypen">
                        <Input
                          value={road_address || jibun_address}
                          placeholder=""
                          readOnly
                        />
                      </div>
                      <div className="item">
                        <button
                          type="button"
                          className="btn"
                          onClick={() => {
                            window.daum.postcode.load(() => {
                              new daum.Postcode({
                                oncomplete: ({zonecode, roadAddress, address}) => {
                                  setForm(curr => ({
                                    ...curr,
                                    zonecode,
                                    road_address: roadAddress,
                                    jibun_address: address
                                  }));
                                }
                              }).open();
                            });
                          }}
                        >
                          주소검색
                        </button>
                      </div>
                    </div>
                    <div className="group">
                      <Input
                        value={address_detail}
                        placeholder=""
                        onChange={({target: {value}}) => {
                          setForm(curr => ({
                            ...curr,
                            address_detail: value
                          }))
                        }}
                      />
                    </div>
                  </dd>
                </dl>
                
                <dl>
                  <dt>배송 메세지</dt>
                  <dd>
                    <div className="group">
                      <div className="item">
                        <Input 
                          value={request}
                          placeholder=""
                          onChange={({target: {value}}) => {
                            setForm(curr => ({
                              ...curr,
                              request: value
                            }))
                          }}
                        />
                      </div>
                      <div className="item">
                        <CheckBox
                          checked={can_receive_on_weekend}
                          onChange={() => {
                            setForm(curr => ({
                              ...curr,
                              can_receive_on_weekend: !curr.can_receive_on_weekend
                            }))
                          }}
                        >
                          주말 및 공휴일 수령가능 유무 
                        </CheckBox>
                        
                      </div>
                    </div>
                  </dd>
                </dl>
              </OrderFormDiv>
            </section>
            <OrderPartSection>
              <div>
                <section>
                  <header>
                    <h3>결제수단</h3>
                  </header>
                  <OrderFormDiv>
                    <dl>
                      <dt className="required">결제 방법</dt>
                      <dd>
                        <div className="group">
                          <div className="item">
                            <Radio
                              checked={pay_method === 'shinhan'}
                              onClick={() => {
                                setForm(curr => ({
                                  ...curr,
                                  pay_method: 'shinhan'
                                }))
                              }}
                            >
                              한의플래닛 카드결제 (-5%)
                            </Radio> 
                          </div>
                          {carts.every(({story: {extension}}) => !!extension && extension.goods_type === 'normal') && (
                            <div className="item">
                              <Radio
                                checked={pay_method === 'card'}
                                onClick={() => {
                                  setForm(curr => ({
                                    ...curr,
                                    pay_method: 'card'
                                  }))
                                }}
                              > 
                                일반결제
                              </Radio>
                            </div>
                          )}
                          {/* <div className="item">
                            <Radio
                              checked={pay_method === 'inipay'}
                              onClick={() => {
                                setForm(curr => ({
                                  ...curr,
                                  pay_method: 'inipay'
                                }))
                              }}
                            > 
                              이니시스
                            </Radio>
                          </div> */}
                        </div>
                      </dd>
                    </dl>
                    {pay_method === 'shinhan' && (
                      <p>한의플래닛 카드 결제(-5%)할인은 <strong>신한카드X한의플래닛 Simple Platinum# 카드</strong>로 결제 시에만 이용 가능합니다.</p>
                    )}
                  </OrderFormDiv>
                </section>
                <section>
                  <header>
                    <h3>결제 동의</h3>
                  </header>
                  <OrderFormDiv>
                    <dl>
                      <dt className="required">
                        <CheckBox
                          checked={confirm_agree}
                          onChange={() => {
                            setForm(curr => ({
                              ...curr,
                              confirm_agree: !confirm_agree
                            }))
                          }}
                        >
                          주문 상품정보 동의
                        </CheckBox>
                      </dt>
                      <dd>
                        <p className="text">
                          주문 상품의 상품명, 가격, 배송, 교환, 환불 내용에 동의합니다.
                        </p>
                      </dd>
                    </dl>
                  </OrderFormDiv>
                </section>
              </div>
              <div>
                <section className="receipt">
                  <header>
                    <h3>결제금액</h3>
                  </header>
                  <div>
                    <OrderReceiptDiv>
                      <dl>
                        <dt>상품 금액</dt>
                        <dd>
                          {numberWithCommas(totalPrice)}
                          <span className="unit">원</span>
                        </dd>
                      </dl>
                      <dl>
                        <dt>배송비</dt>
                        <dd>
                          {numberWithCommas(totalDeliveryFee)}
                          <span className="unit">원</span>
                        </dd>
                      </dl>
                      {pay_method === 'shinhan' && (
                        <dl>
                          <dt>
                            제휴카드 할인<small>(5%)</small>
                          </dt>
                          <dd>
                            {numberWithCommas(discount)}
                            <span className="unit">원</span>
                          </dd>
                        </dl>
                      )}
                      <dl className="result">
                        <dt>
                          <em>
                            결제 금액
                          </em>
                        </dt>
                        <dd>
                          <em>
                            {numberWithCommas(totalPrice + totalDeliveryFee - discount)}
                          </em>
                          &nbsp;<span className="unit">원</span>
                        </dd>
                      </dl>
                    </OrderReceiptDiv>
                    <div className="btn-group">
                      <button
                        type="button"
                        onClick={() => {
                          confirm('주문을 취소하시겠습니까?') && router.back();
                        }}
                      >
                        주문 취소
                      </button>
                      <button
                        className="blue"
                        type="button"
                        onClick={() => {
                          submit()
                        }}
                      >
                        결제
                      </button>
                    </div>
                    <div className="banner">
                      <A
                        to="https://www.shinhancard.com/pconts/html/card/apply/credit/1196411_2207.html?EntryLoc2=2988&empSeq=501"
                        newTab={true}
                      >
                        <img 
                          src={staticUrl('/static/images/banner/banner-haniplanet-card.png')}
                          title="한의플래닛, 신한카드 콜라보 이벤트 페이지로 연결"
                          alt="플래닛 마켓을 이용하는 가장 스마트한 방법. 한의플래닛, 신한카드 콜라보 이벤트 페이지로 연결"
                        />
                      </A>
                    </div>
                  </div>
                </section>
              </div>
            </OrderPartSection>
          </>
        )}
      </div>
      {pay_method === 'shinhan' && (
        <form
          ref={formRef}
          method="POST" 
          action={`${SHINHAN_PG_SERVER_DOMAIN}/payment/`}
          accept-charset="UTF-8"
          target="payment_popup"
        >
            {/* 할부개월(00~12) */}<input type="hidden" name="SelectQuota" value="00"/>
            {/*포인트 사용(1:예, 0:아니오)*/} <input type="hidden" name="SelectPoint" value="0"/>
        
            {/* 상품명*/} <input type="hidden" name="GoodsName" value={paymentName}/> 
            {/* 상품갯수 */} <input type="hidden" name="GoodsCnt" value={totalCnt}/>
            {/* 상품가격*/} <input type="hidden" name="price" value={totalPrice + totalDeliveryFee - discount}/> 
            {/* 상품주문번호 */}<input type="hidden" name="Moid" value={merchantUid}/>
        
            {/* 구매자 이름  */}<input type="hidden" name="BuyerName" value={me.name}/>
            {/* 구매자 이메일  */}<input type="hidden" name="BuyerEmail" value={me.email}/>
            {/* 구매자 전화번호 */}<input type="hidden" name="BuyerTel" value={me.phone}/>
            {/* 구매자 주소(우편번호) */}<input type="hidden" name="BuyerPostNo" value={zonecode}/>
            {/* 구매자 주소(상세주소) */}<input type="hidden" name="BuyerAddr" value={`${(road_address || jibun_address)} ${address_detail}`}/>

            {/* 상점 고객 아이디 */}<input type="hidden" name="MallUserID" value={me.id}/>
            {/* 상품구분(1:실물, 0:컨텐츠) */}<input type="hidden" name="GoodsCl" value="1"/>
            <input type="hidden" name="origin" value={location.origin}/>
        </form>      
      )}
    </CommonWrapper>
  )
};


Order.displayName = 'Order';
export default React.memo(Order);

import * as React from 'react';
import {CartTable, CommonWrapper} from '../../components/shopping/style/order';
import Checkbox from "../../components/UI/Checkbox1/CheckBox";
import OGMetaHead from "../../components/OGMetaHead";
import {useRouter} from "next/router";
import ShoppingApi from '../../src/apis/ShoppingApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import Page500 from '../../components/errors/Page500';
import Loading from '../../components/common/Loading';
import CartItem from '../../components/shopping/CartItem';
import {numberWithCommas} from '../../src/lib/numbers';
import {isPeriodDate} from '../../src/lib/date';
import isEmpty from 'lodash/isEmpty';
import NoContent from '../../components/NoContent/NoContent';
import loginRequired from '../../hocs/loginRequired';
import {GOODS_ORDER_MAX_QUANTITY} from '../../src/constants/shopping';

const MAX_GOODS_COUNT = 20;

const Cart = () => {
  // Router
  const router = useRouter();

  // API
  const shoppingApi = useCallAccessFunc(access => new ShoppingApi(access));

  // State
  const [orderCartIds, setOrderCartIds] = React.useState([]);
  const [carts, setCarts] = React.useState([]);
  const [{
    pending,
    error
  }, setRequestState] = React.useState({
    pending: true,
    error: false
  });

  React.useEffect(() => {
    shoppingApi.carts()
      .then(({data: {results}}) => {
        setCarts(results);
        setRequestState(curr => ({
          ...curr,
          pending: false,
        }))
      })
      .catch(() => {
        setRequestState({
          pending: false,
          error: true,
        })
      });
  }, []);

  React.useEffect(() => {
    if(!isEmpty(carts)) productSelectBulk(true);
  }, [carts])

  const totalPrice = React.useMemo(() => {
    return carts.reduce((prevValue, {id, product, quantity}) => {
      if(orderCartIds.indexOf(id) === -1) {
        return prevValue;
      }
      const {
        price,
        sale_start_at,
        sale_end_at,
        sale_price
      } = product;

      return prevValue + ((isPeriodDate(sale_start_at, sale_end_at) && sale_price ? sale_price : price) * quantity);
    }, 0);
  }, [carts, orderCartIds]);

  const totalDeliveryFee = React.useMemo(() => {
    return carts.reduce((prevValue, {id, story: {extension}}) => {
      if(!extension || orderCartIds.indexOf(id) === -1) return prevValue;

      const {
        delivery_fee = 0,
        delivery_fee_free_over = 0
      } = extension;
      
      if(totalPrice < delivery_fee_free_over) return prevValue + delivery_fee;
      return prevValue;
    }, 0);
  }, [totalPrice]);

  const productSelectBulk = (state: boolean = false) => {
    setOrderCartIds(
      state 
        ? carts.map(({id}) => id)
        : []
    );
  }
  
  if(error) {
    return <Page500/>
  }

  return (
    <CommonWrapper>
      <OGMetaHead title="장바구니"/>
      <header>
        <h2>장바구니</h2>
        <ol>
          <li className="active">
            <em>01</em>
            장바구니
          </li>
          <li>
            <em>02</em>
            주문/결제
          </li>
          <li>
            <em>03</em>
            주문 완료
          </li>
        </ol>
      </header>
      <section>
        {pending ? (
          <Loading/>
        ) : (
          <>
            <CartTable>
              <thead>
              <tr>
                <th>
                  <Checkbox
                    checked={orderCartIds.length === carts.length}
                    onChange={() => productSelectBulk(orderCartIds.length !== carts.length)}
                  />
                </th>
                <th>이미지</th>
                <th>상품 정보</th>
                <th>수량</th>
                <th>상품 가격</th>
                <th>총 상품 금액</th>
                <th>배송비</th>
              </tr>
              </thead>
              <tbody>
                {isEmpty(carts) ? (
                  <tr>
                    <td colSpan="7">
                      <NoContent className="no-content">
                        장바구니가 비었습니다.
                      </NoContent>
                    </td>
                  </tr>
                ) : (
                  carts.map(({
                    id,
                    story: {id: storyId, extension, images, ...story},
                    product: {capacity, ...product},
                    ...props
                  }) => (
                    <CartItem
                      {...props}
                      {...story}
                      {...extension}
                      {...product}
                      id={id}
                      key={id}
                      thumbnail={images ? (images[0] || {}).image : ''}
                      storyId={storyId}
                      checked={orderCartIds.includes(id)}
                      max_amount={capacity === null ? GOODS_ORDER_MAX_QUANTITY : capacity}
                      onChangeData={data => {
                        shoppingApi.updateCart(id, data)
                          .then(({ status, data }) => {
                            if(status === 200) {
                              setCarts(curr => curr.map(currCart => {
                                return currCart.id === id
                                  ? ({ ...currCart, quantity: data.result.quantity })
                                  : currCart
                              }));

                              alert('변경 되었습니다.');
                            }
                            
                          })
                      }}
                      onChangeChecked={() => {
                        setOrderCartIds(curr => curr.includes(id) 
                          ? curr.filter(_id => _id !== id) 
                          : [...curr, id])
                      }}
                    />
                  ))  
                )}
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
            <div className="btn-group">
              <button
                type="button"
                onClick={() => {
                  if (orderCartIds.length === 0) {
                    alert('삭제할 항목을 선택해주세요');
                    return false;
                  } else {
                    confirm('장바구니 목록에서 삭제됩니다. 삭제하시겠습니까?')
                    && shoppingApi.deleteCart({id: orderCartIds}).then(({ status }) => status === 200
                      && setCarts(curr =>
                        curr.filter(({ id }) =>
                          !orderCartIds.includes(id)))
                    );
                  }
                }}
              >
                삭제
              </button>
              <button
                className="blue"
                type="button"
                onClick={() => {
                  if(orderCartIds.length === 0) {
                    alert('주문 하실 상품을 선택해주세요.');
                    return false;
                  }
                  if(orderCartIds.length > MAX_GOODS_COUNT) {
                    alert(`${MAX_GOODS_COUNT}개의 상품까지만 주문이 가능합니다.`);
                    return false;
                  }
                  router.push(`/shopping/order?${orderCartIds.reduce(
                    (prev, id) => {
                      const pair = `id[]=${id}`;
                      if (prev) {
                        prev += '&'
                      }
                      prev += pair;
  
                      return prev;
                    }, '')}`)
                }}
              >
                주문
              </button>
            </div>
          </>
        )}
        
      </section>
    </CommonWrapper>
  )
};

Cart.displayName = 'Cart';
export default loginRequired(React.memo(Cart));

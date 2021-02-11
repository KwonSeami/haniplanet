import * as React from 'react';
import styled from "styled-components";
import classNames from "classnames";
import OGMetaHead from "../../../components/OGMetaHead";
import {useRouter} from "next/router";
import Counter from "../../../components/UI/Counter";
import {GoodsDetailWrapperDiv} from '../../../components/shopping/style/goods';
import {backgroundImgMixin, IBackgroundImgMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import {numberWithCommas} from "../../../src/lib/numbers";
import SelectBox from "../../../components/inputs/SelectBox";
import Loading from "../../../components/common/Loading";
import ReverseCommentArea from "../../../components/comment/ReverseCommentArea";
import {Waypoint} from "react-waypoint";
import Page404 from "../../../components/errors/Page404";
import {useQuery} from '@apollo/react-hooks';
import {SOB} from '../../../src/gqls/shopping';
import isEmpty from 'lodash/isEmpty';
import {useDispatch} from 'react-redux';
import {saveStory} from '../../../src/reducers/orm/story/storyReducer';
import cloneDeep from 'lodash/cloneDeep';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import StoryApi from '../../../src/apis/StoryApi';
import ShoppingApi from '../../../src/apis/ShoppingApi';
import {IStoryGoods, IProduct} from '../../../src/@types/shopping';
import {isPeriodDate} from '../../../src/lib/date';
import Link from 'next/link';
import {GOODS_ORDER_MAX_QUANTITY, SHINHAN_DISCOUNT_PERCENTAGE} from '../../../src/constants/shopping';
import A from '../../../components/UI/A';
import range from 'lodash/range';
import loginRequired from '../../../hocs/loginRequired';
import IdentifiedCommentInput from '../../../components/comment/inputs/IdentifiedCommentInput';
import ArrowSlider, {ARROW_SLIDER_DEFAULT_OPTION} from '../../../components/ArrowSlider';

const BGImg = styled.div<IBackgroundImgMixin & {className?: string}>`
  ${props => backgroundImgMixin(props)}
`;

const ShoppingDetail = () => {
  // Router
  const router = useRouter();
  const {query: {id}} = router;
  const hash = typeof window ? window.location.hash : '';

  // Redux
  const dispatch = useDispatch();

  // Api
  const storyApi = useCallAccessFunc(access => new StoryApi(access));
  const shoppingApi = useCallAccessFunc(access => new ShoppingApi(access));

  // Query
  const {
    data: {sob} = {sob}, 
    loading, 
    error,
    updateQuery
  } = useQuery(SOB, {
    variables: {id}
  });

  const {
    title,
    images: _images,
    body_images,
    products,
    is_sold_out,
    is_follow,
    body,
    goods,
    descriptions,
    tags = [{}]
  } = sob || {} as IStoryGoods;

  const {
    origin,
    manufacturer,
    min_amount,
    max_amount,
    unit_price,
    delivery_fee,
    delivery_fee_free_over,
    delivery_notice,
    payment_notice,
    refund_notice,
    as_notice,
    service_center,
    detail_name,
    volume,
    weight,
    kc_expose,      
    kc_number,
    is_expose_card_price
  } = goods || {} as IGoods;

  const {goods_categories = [{}]} = tags[0] || {};
  const {notice_html} = goods_categories[0] || {};
  
  const qnaRef = React.useRef(null);
  const {current: qnaCurrent} = qnaRef || {};

  // State
  const [imageOnIdx, setImageOnIdx] = React.useState(0);
  const [tabPosition, setTabPosition] = React.useState('static');
  const [activeTab, setActiveTab] = React.useState(hash || '');

  // 결제 관련
  const [quantity, setQuantity] = React.useState(1);
  const [productId, setProductId] = React.useState('');
  const [optionIds, setOptionIds] = React.useState([]);

  const productObj = React.useMemo(() => {
    let obj = {};
    if(products) {
      products.forEach(({id, ...items}) => {
        obj[id] = { id, ...items};
      })
    }

    return obj;
  }, [products]);


  // 선택된 옵션 데이터 (default value: products[0])
  const {
    capacity,
    price,
    sale_price,
    isSalePeriod
  }:IProduct = React.useMemo(() => {
    if(!productObj || isEmpty(products)) return {};

    const product = productId ? productObj[productId] : products[0];

    return {
      ...product,
      isSalePeriod: isPeriodDate(product.sale_start_at, product.sale_end_at)
    }
  }, [productObj, productId]);

  const images = React.useMemo(() => {
    if(!isEmpty(_images)) {
      return _images.map(str => JSON.parse(str));  
    }

    return [];
  },[_images]);

  React.useEffect(() => {
    setQuantity(min_amount);
  }, [productId, min_amount])

  React.useEffect(() => {
    if(!loading) {
      let story = cloneDeep(sob);
      delete story.goods;

      dispatch(saveStory({
        id,
        ...story,
        extension: goods
      }))
    }
  }, [sob]);

  const SliderRef = React.useRef(null);

  if(loading) {
    return <Loading/>;
  }
  if(error) {
    return <Page404/>;
  }

  const goodsPrice = isSalePeriod ? (sale_price || price) : price;

  // TODO: 품절
  return (
    <GoodsDetailWrapperDiv>
      <OGMetaHead title={title}/>
      <section className="basic-info clearfix">
        <div className="images">
          {/* <BGImg
            className="img"
            img={images[imageOnIdx]?.image || staticUrl('/static/images/banner/no-image.png')}
          /> */}
          {!isEmpty(images) ? (
            <>
              <ArrowSlider
                {...ARROW_SLIDER_DEFAULT_OPTION}
                ref={SliderRef}
                onChange={page => {
                  setImageOnIdx(page);
                }}
              >
                {images.map(({image}, idx) => (
                  <div key={image}>
                    <BGImg
                      className={classNames('img', {on: idx === imageOnIdx})}
                      onClick={() => setImageOnIdx(idx)}
                      img={image}
                    />
                  </div>
                ))}
              </ArrowSlider>
              <ul className="thumbnails">
                {images.map(({image}, idx) => (
                  <li key={image}>
                    <BGImg
                      className={classNames('img', {on: idx === imageOnIdx})}
                      onClick={() => {
                        SliderRef.current.move(idx);
                      }}
                      img={image}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <img 
              src={staticUrl('/static/images/banner/no-image.png')}
              alt="등록 된 썸네일 이미지가 없습니다."
            />
          )}
        </div>
        <div className="basic-info-text">
          <h2>
            {title}
            <span
              onClick={() => {
                storyApi.follow(id)
                  .then(({status}) => {
                    if(status === 200) {
                      updateQuery(({
                        sob: {
                          is_follow,
                          ...rest
                        }
                      }) => ({
                        sob: {
                          is_follow: !is_follow,
                          ...rest
                        }
                      }))
                    }
                  })
              }}
            >
              {is_follow ? (
                <img
                  src={staticUrl('/static/images/icon/icon-heart-on.png')}
                  alt="heart"
                />
              ) : (
                <img
                  src={staticUrl('/static/images/icon/icon-heart-bg.png')}
                  alt="heart"
                />
              )}
            </span>
          </h2>
          <div className="price-area">
            <dl>
              {!!sale_price ? (
                <>
                  {isSalePeriod && (
                    <>
                      <dt>판매가</dt>
                      <dd>
                        <del>
                          {numberWithCommas(price * quantity)}
                          <span className="unit">원</span>
                        </del>
                      </dd>
                      <dt>할인율</dt>
                      <dd>
                        <span className="percentage">{100-Math.round((sale_price/price) * 100)}%</span>
                      </dd>
                    </>
                  )}
                  <dt>회원가</dt>
                  <dd>
                    {unit_price && (
                      <small className="text">
                        (개당 가격: <span className="price">{unit_price}</span>)
                      </small>
                    )}
                    <strong>
                      {numberWithCommas(goodsPrice * quantity)}<span className="unit">원</span>
                    </strong>
                  </dd>
                </>
              ) : (
                <>
                  <dt>회원가</dt>
                  <dd>
                    {unit_price && (
                      <small className="text">
                        (개당 가격: <span className="price">{unit_price}</span>)
                      </small>
                    )}
                    <strong>
                      {numberWithCommas(goodsPrice * quantity)}<span className="unit">원</span>
                    </strong>
                  </dd>
                </>
              )}
            </dl>
            {is_expose_card_price ? (
              <dl>
                <dt>한의플래닛 카드 <em>5%</em> 할인가</dt>
                <dd>
                  <i>+{SHINHAN_DISCOUNT_PERCENTAGE*100}%</i>
                  <em>
                    {numberWithCommas((goodsPrice-(goodsPrice * SHINHAN_DISCOUNT_PERCENTAGE)) * quantity)}
                    <span className="unit">원</span>
                  </em>
                </dd>
              </dl>
            ) : id !== 'eXtdAM' && (
              <p>
                <em>한의플래닛 카드 결제 시, 추가 5% 할인!</em><br/>
                장바구니에서 확인 가능합니다.
              </p>
            )}
          </div>
          <table>
            <colgroup>
              <col width="30%"/>
              <col width="70%"/>
            </colgroup>
            {manufacturer && (
              <tr>
                <th>제조사</th>
                <td>{manufacturer}</td>
              </tr>
            )}
            {origin && (
              <tr>
                <th>원산지</th>
                <td>{origin}</td>
              </tr>
            )}
            <tr>
              <th>옵션선택</th>
              <td className="select">
                {products && (
                  <SelectBox
                    option={[
                      {
                        label: '옵션 선택',
                        value: '',
                        disabled: true
                      },
                      ...products.map(({
                        name, 
                        text, 
                        price, 
                        sale_price,
                        sale_start_at,
                        sale_end_at,
                        capacity,
                        id
                      }) => {
                        const optionPrice = 
                          isPeriodDate(sale_start_at, sale_end_at) && sale_price 
                            ? sale_price
                            : price;

                        return {
                          label: `
                            ${capacity === 0 ? `[품절] ` : ''}
                            ${name}
                            ${text ? `(${text})` : ''}
                            ${!!optionPrice ? ` (${numberWithCommas(optionPrice)}원)` : ''}
                          `,
                          value: id,
                          disabled: capacity === 0
                        }
                      })
                    ]}
                    value={productId}
                    onChange={value => setProductId(value)}
                  />
                )}
              </td>
            </tr>
            <tr>
              <th>배송비</th>
              <td>
                {delivery_fee ? `${numberWithCommas(delivery_fee)} 원` : '무료배송'}
                {delivery_fee_free_over && (
                  <small>({numberWithCommas(delivery_fee_free_over)}원 이상 무료배송)</small>
                )}
              </td>
            </tr>
          </table>
          <div className="order-btn-group">
            {!is_sold_out ? (
              <>
                <div>
                  <Counter 
                    min={min_amount}
                    max={max_amount || (capacity === null ? GOODS_ORDER_MAX_QUANTITY : capacity)}
                    value={quantity}
                    onChange={value => setQuantity(value)}
                  />
                </div>
                <div>
                  <button
                    className="order-btn"
                    onClick={() => {
                      if (!productId) {
                        alert('상품을 선택해주세요');
                        return false;
                      }
                      shoppingApi.createCart(id, {
                        product: productId,
                        options: optionIds,
                        quantity
                      })
                      .then(res => {
                        if (res.status === 201) {
                          confirm('장바구니에 담겼습니다. 이동하시겠습니까?') && router.push('/shopping/cart');
                        } else if (res.status === 403) {
                          alert('장바구니에 해당 옵션을 담을 권한이 없습니다.');
                        }
                      })
                    }}
                  >
                    장바구니 담기
                  </button>
                </div>
              </>
            ) : (
              <p className="sold-out">Sold out</p>
            )}
          </div>
          <div className="banner">
            <A
              to="https://www.shinhancard.com/pconts/html/card/apply/credit/1196411_2207.html?EntryLoc2=2988&empSeq=501"
              newTab={true}
            >
              <img 
                src={staticUrl('/static/images/banner/banner-haniplanet-card--long.jpg')}
                title="한의플래닛, 신한카드 콜라보 이벤트 페이지로 연결"
                alt="플래닛 마켓을 이용하는 가장 스마트한 방법. 한의플래닛, 신한카드 콜라보 이벤트 페이지로 연결"
              />
            </A>
          </div>
        </div>
      </section>
      <div className="tab-waypoint">
        <Waypoint
          scrollableAncestor={window}
          onLeave={() => setTabPosition('fixed')}
          onEnter={() => setTabPosition('static')}
        >
          <div/>
        </Waypoint>
      </div>
      <div className="tabs">
        <ul className={tabPosition}>
          <li className={classNames({on: activeTab === '#shopping-info'})}>
            <Link
              href="#shopping-info"
            >
              <a>상품정보</a>
            </Link>
          </li>
          {/*<li className={classNames({on: hash === '#review-info'})}>*/}
          {/*  <a href="#review-info">상품후기</a>*/}
          {/*</li>*/}
          <li className={classNames({on: activeTab === '#qna-info'})}>
            <Link
              href="#qna-info"
            >
              <a>상품후기 및 문의</a>
            </Link>
          </li>
          <li className={classNames({on: activeTab === '#delivery-info'})}>
            <Link
              href="#delivery-info"
            >
              <a>배송/교환/환불</a>
            </Link>            
          </li>
        </ul>
      </div>
      <Waypoint
        topOffset="187px"
        onEnter={() => setActiveTab('#shopping-info')}
        onLeave={({currentPosition}) => currentPosition === 'above' && setActiveTab('#qna-info')}
      >
        <section className="tab-section shopping-info">
          <h3>
            상품정보
            <span id="shopping-info"/>
          </h3>
          <h4>필수표기정보</h4>
          <div className="tables">
            <table>
              <colgroup>
                <col width="16%"/>
                <col width="34%"/>
                <col width="16%"/>
                <col width="34%"/>
              </colgroup>
              <tbody>
              {(detail_name || origin) && (
                <tr>
                  {detail_name && (
                    <>
                      <th>상품 상세명</th>
                      <td
                        colSpan={!origin ? 3 : 1}
                      >
                        {detail_name}
                      </td>
                    </>
                  )}
                  {origin && (
                    <>
                      <th>원산지</th>
                      <td 
                        className="pre"
                        colSpan={!detail_name ? 3 : 1}
                      >
                        {origin}
                      </td>
                    </>
                  )}
                </tr>
              )}
              {(weight || volume) && (
                <tr>
                  {weight && (
                    <>
                      <th>중량</th>
                      <td
                        className="pre"
                        colSpan={!volume ? 3 : 1}
                      >
                        {weight}
                      </td>
                    </>
                  )}
                  {volume && (
                    <>
                      <th>용량</th>
                      <td 
                        className="pre"
                        colSpan={!weight ? 3 : 1}
                      >
                        {volume}
                      </td>
                    </>
                  )}
                </tr>
              )}
              {!isEmpty(descriptions) && (
                range(0, Math.ceil(descriptions.length/2)).map(idx => {
                  const start = idx * 2;
                  const end = start + 2;
                  
                  return (
                    <tr>
                      {descriptions.slice(start,end).map(({
                        id, 
                        title, 
                        description
                      }, index) => (
                        <>
                          <th>{title}</th>
                          <td
                            className="pre"
                            colSpan={(descriptions.length === (start+index+1) && descriptions.length % 2) ? 3 : 1}
                          >
                            {description}
                          </td>
                        </>
                      ))}
                    </tr>
                  )
                })
              )}
              {(kc_expose && kc_number) && (
                <tr>
                  <th>KC인증 번호</th>
                  <td colSpan={3}>{kc_number}</td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
          {(!isEmpty(body_images) || body || notice_html) && (
            <div className="detail">
              {notice_html && (
                <div dangerouslySetInnerHTML={{__html: notice_html}}/>
              )}
              {body_images && body_images.map(({image}) => (
                <img src={image} alt="상품 상세 정보 이미지"/>
              ))}
              {body && (
                <div dangerouslySetInnerHTML={{__html: body}} />
              )}
            </div>
          )}
        </section>
      </Waypoint>
      {/*<section className="tab-section review-info" id="review-info">*/}
      {/*  <h3>상품후기</h3>*/}
      {/*  <GoodsReview*/}
      {/*    id={id}*/}
      {/*  />*/}
      {/*</section>*/}
      <Waypoint
        topOffset="187px"
        onLeave={({currentPosition}) => {
          const activeContent = currentPosition === 'above' ? 'delivery-info' : 'shopping-info';
          setActiveTab(`#${activeContent}`);
        }}
      >
        <section 
          className="tab-section qna-info"
          ref={qnaRef}
        >
          <h3>
            상품후기 및 문의
            <span id="qna-info" />
          </h3>
          <ReverseCommentArea
            targetPk={id}
            targetName="shopping"
            targetUserExposeType="real"
            inputComponent={IdentifiedCommentInput}
          />
        </section>
      </Waypoint>
      <Waypoint
        topOffset="187px"
        onLeave={({currentPosition, waypointTop}) => {
          if(currentPosition === 'below') {
            const {
              clientHeight: qnaHeight
            } = qnaCurrent || {clientHeight: 0};

            // 탭클릭이 아닌 순수 스크롤로 해당 컨텐츠를 벗어날때만
            if((qnaHeight + window.innerHeight) > waypointTop) {
              setActiveTab('#qna-info')
            }
          }
        }}
      >
        <section className="tab-section delivery-info">
          <h3>
            배송/교환/환불
            <span id="delivery-info"/>
          </h3>     
          <table>
            <colgroup>
              <col width="150px"/>
              <col/>
            </colgroup>
            <tbody>
            <tr>
              <th>배송 안내</th>
              <td
                className="pre-line"
                dangerouslySetInnerHTML={{__html: delivery_notice}}
              />
            </tr>
            <tr>
              <th>결제 안내</th>
              <td
                className="pre-line"
                dangerouslySetInnerHTML={{__html: payment_notice}}
              />
            </tr>
            <tr>
              <th>교환 및 환불 안내</th>
              <td
                className="pre-line"
                dangerouslySetInnerHTML={{__html: refund_notice}}
              />
            </tr>
            <tr>
              <th>A/S 안내</th>
              <td
                className="pre-line"
                dangerouslySetInnerHTML={{__html: as_notice}}
              />
            </tr>
            <tr>
              <th>서비스 센터</th>
              <td
                className="pre-line kakao"
                dangerouslySetInnerHTML={{__html: service_center}}
              />
            </tr>
            </tbody>
          </table>
        </section>
      </Waypoint>
    </GoodsDetailWrapperDiv>
  );
};

ShoppingDetail.displayName = 'ShoppingDetail';
export default React.memo(loginRequired(ShoppingDetail));

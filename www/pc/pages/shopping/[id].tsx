import * as React from 'react';
import styled from "styled-components";
import classNames from "classnames";
import OGMetaHead from "../../components/OGMetaHead";
import { useDispatch, useSelector } from "react-redux";
import { pickStorySelector } from "../../src/reducers/orm/story/selector";
import { useRouter } from "next/router";
import { fetchShopThunk } from "../../src/reducers/orm/story/thunks";
import Counter from "../../components/UI/Counter";
import CommentArea from '../../components/comment/DefaultCommentArea';
import { $BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE } from '../../styles/variables.types';
import { backgroundImgMixin, fontStyleMixin, heightMixin, IBackgroundImgMixin } from '../../styles/mixins.styles';
import { CircularGridLines, RadarChart } from 'react-vis';
import { Gauge } from "@hanii/planet-rating";
import { BASE_URL, staticUrl } from '../../src/constants/env';
import { numberWithCommas } from "../../src/lib/numbers";
import SelectBox from "../../components/inputs/SelectBox";
import Loading from "../../components/common/Loading";
import { Api } from "@hanii/planet-apis/dist";
import ReverseCommentArea from "../../components/comment/ReverseCommentArea";
import { Waypoint } from "react-waypoint";
import Page404 from "../../components/errors/Page404";

const LAYOUT_WIDTH = 980;

const Div = styled.div`
  width: ${LAYOUT_WIDTH}px;
  margin: 20px auto 50px;
  
  table {
    th, td {
      text-align: left;
    }
  }
  
  .images {
    width:410px;
    float: left;
    .img {
      width: 410px;
      height: 410px;
    }
    .thumbnails {
      margin-top: 7px;
      li {
        display: inline-block;
        margin-right: 10px;
        :last-child {
          margin-right: 0;
        }
      }
      .img {
        width: 60px;
        height: 60px; 
        box-sizing: border-box;
        
        &.on {
          border-color: ${$POINT_BLUE};
        }
        border: 2px solid #fff;
      }
    }
  }
  .basic-info-text {
    width: 480px;
    float: right;
    > div {
      padding: 20px 0;
      border-bottom: 2px solid #eee;
      :last-child {
        border: none;
      }
    }
    .price-area {
      span {
        color: #ae0000;
        font-size: 18px;
      }
      .price {
        font-weight: 700;
      }
      .base-price {
        font-size: 14px;
      }
    }
    table {
      tr:last-child {
        th, td {
          border-bottom: none;
        }
      }
      th {
        padding: 8px 16px;
        border-bottom: 1px solid #eee;
        background-color: #fafafa;
        color: #111;
        font-weight: 400;
        font-size: 12px;
      }
      td {
        padding: 12px 16px;
        color: #333;
        border-bottom: 1px solid #eee;
        border-right: none;
        border-left: none;
        border-top: none;
        line-height: 17px;
        font-size: 12px;
      }
    }
  }
  .tab-waypoint {
    position: relative;
    div {
      position: absolute;
      top: -60px;
    }
  }
  .tabs {
    margin-top: 50px;
    height: 57px;
    ul {
      &.fixed {
        position: fixed;
        top: 120px;
        left: 50%;
        margin-left: -${LAYOUT_WIDTH / 2}px;
        width: ${LAYOUT_WIDTH}px;
        z-index: 3;
      }
      li {
        display:inline-block;
        width: 33.333333%;
        color: #555;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        border: 1px solid #ccc;
        border-top: 2px solid #555;
        background-color: #fafafa;
        box-sizing: border-box;
        cursor: pointer;
        a {
          padding:15px;
          width: 100%;
          display: block;
        }
        
         &.on {
          color: #111;
          border-bottom-color: #fff;
          background-color: #fff;
         }
         &:first-child ~ li {
          border-left: 0;
         }
         
         span {
          font-size: 14px;
         }
      }
    } 
  }
  .tab-section {
    table {
      tr:first-child {
        th, td {
          border-top: 1px solid #eee;
        }
      }
      th {
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        background-color: #fafafa;
        color: #111;
        font-weight: 400;
        font-size: 12px;
      }
      td {
        padding: 12px 16px;
        color: #333;
        border-bottom: 1px solid #eee;
        border-right: none;
        border-left: none;
        border-top: none;
        line-height: 17px;
        font-size: 12px;
      }
    }
  }
  h3 { 
    position: relative;;
    margin-top: 26px;
    margin-bottom: 14px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    span {
      position: absolute;
      top: -200px;
    }
  }
  h4 {
    margin-top: 30px;
    padding-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
  }
  .order-btn {
    width: 160px; 
    border: 1px solid ${$BORDER_COLOR};
    cursor: pointer;
    ${heightMixin(40)}
    ${fontStyleMixin({
      color: $GRAY,
      size: 15
    })}
    

    &.buy {
      border: 0;
      background-color: ${$POINT_BLUE};
      color: ${$WHITE};
    }

    &-group {
      font-size: 0;

      div {
        display: inline-block;
        vertical-align: middle;

        & ~ div {
          margin-left: 10px;
        }
      }
    }
  }
`;

const ReviewWrapperDiv = styled.div`
  & > article {
    font-size: 0;
    border-bottom: 1px solid ${$BORDER_COLOR};

    & > div {
      display: inline-block;
      width: 33.3%;
      padding:0 30px;
      vertical-align: middle;
      box-sizing: border-box;
      font-size: 14px;
    }
  }

  .gauge {
    &-detail {
      dl {
        display: table;
        table-layout: fixed;
        width: 100%;

        & ~ dl {
          margin-top: 10px;
        }
      }
      dt, dd {
        display: table-cell;
        font-size:14px;
        vertical-align: middle;
      }
  
      dt {
        width: 80px;
        padding-right: 20px;
        color: #333;
        font-weight: 500;
        text-align: right;
        box-sizing: border-box;
      }
    }
    &-average {
      width: 28%;
      ul.off li {
        span {
          color: ${$TEXT_GRAY};
        }
      }
      
      li {
        display: inline-block;
        width: 50%;

        img {
          vertical-align: middle;
          width: 15px;
          height: 15px;
          margin-right: 3px;
          padding-top: 3px;
        }

        p {
          display: inline-block;
          vertical-align: middle;
          padding-top: 3px;
          ${fontStyleMixin({
            size: 14,
            weight: '800'
          })};
          
          span {
            padding-left: 4px;
            ${fontStyleMixin({
              weight: '800',
              color: $POINT_BLUE
            })};
          }
        }

        & + li {
          text-align: right;
          
          p {
            display: inline-block;
            vertical-align: middle;
            ${fontStyleMixin({
              size: 12,
              weight: '600',
              color: $POINT_BLUE
            })};
          }

          span {
            vertical-align: middle;
            margin-left: 6px;
            ${fontStyleMixin({
              size: 39,
              weight: '300',
              color: $POINT_BLUE,
              family: 'Montserrat'
            })};
          }
        }
      }

      
    }
  }
`

const GoodsReview = React.memo(({
  id
}) => {
  const rating_count = 1;
  const ratings = [
    { 
      "id": 796, 
      "name": "배송비", 
      "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/9c1f3580-1454-4969-85a6-b0415478f8e6.png", 
      "sum_score": 8, 
      "rating_count": 1 
    }, 
    { 
      "id": 797, 
      "name": "가격", 
      "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/56240d2e-02e8-4e17-a613-98f7ebbb14ba.png", 
      "sum_score": 8, 
      "rating_count": 1 
    }, 
    { 
      "id": 798, 
      "name": "품질", 
      "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/1938137b-dad7-4039-aca8-8ed03dbc7747.png", 
      "sum_score": 8, 
      "rating_count": 1 
    }, 
    { 
      "id": 2293, 
      "name": "가성비", 
      "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/1f0ce398-456e-442d-bf38-10992d1be0c5.png", 
      "sum_score": 8, 
      "rating_count": 1 
    }, 
    { 
      "id": 2294, 
      "name": "맛", 
      "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/266b4f26-6a98-4a2f-8981-ce8488386423.png", 
      "sum_score": 8, 
      "rating_count": 1 
    }, 
  ];

  return (
    <ReviewWrapperDiv>
      <article>
        <div className="gauge-average">
          <ul className={classNames({off: rating_count === 0})}>
            <li>
              <img
                src={staticUrl('/static/images/pc/icon/icon-story-face.png')}
                alt="참여"
              />
              <p>
                참여
                <span>{rating_count}명</span>
              </p>
            </li>
            <li>
              <p>총점</p>
              <span>{8.5}</span>
            </li>
          </ul>
          <Gauge
            max={10}
            curr={8.5}
            width={100}
          />
        </div>
        <div className="graph">
          <RadarChart
            animation
            colorRange={[$POINT_BLUE]}
            domains={ratings.map(({name}) => ({name, domain: [0, 10]}))}
            data={[ratings.reduce((prev, {name, sum_score}) => {
              prev[name] = sum_score / rating_count;
              return prev;
            }, {})]}
            style={{
              polygons: {
                fillOpacity: 0.2,
                strokeWidth: 0,
                backgroundColor: $WHITE,
                color: $WHITE,
              },
              axes: {
                line: {
                  backgroundColor: $WHITE,
                  color: $WHITE,
                },
                ticks: {
                  backgroundColor: $WHITE,
                  color: $WHITE,
                },
                text: {
                  opacity: 1,
                  backgroundColor: $WHITE,
                  color: $WHITE,
                },
              },
              labels: {
                textAnchor: 'middle'
              }
            }}
            margin={{
              left: 60,
              top: 40,
              bottom: 35,
              right: 60
            }}
            colorType={$WHITE}
            tickFormat={t => ''}
            width={300}
            height={270}
          >
            <CircularGridLines
              tickValues={[1.2, ...new Array(5)].map((_, i) => i / 5 - 1)}
              color={0}
              width={200}
              height={200}
              style={{
                fill: $WHITE,
                fillOpacity: 0,
                stroke: '#f0f0f0',
                axes: {
                  fill: $WHITE,
                  fillOpacity: 0,
                  stroke: '#f0f0f0',
                  circle: {
                    fill: $WHITE,
                    fillOpacity: 0,
                    stroke: '#f0f0f0',
                  }
                }
              }}
            />
          </RadarChart>
        </div>
        <div className="gauge-detail">
          <dl>
            <dt>배송비</dt>
            <dd>
              <Gauge
                max={10}
                curr={8.5}
                width={100}
              />
            </dd>
          </dl>
          <dl>
            <dt>가성비</dt>
            <dd>
              <Gauge
                max={10}
                curr={4}
                width={100}
              />
            </dd>
          </dl>
          <dl>
            <dt>품질</dt>
            <dd>
              <Gauge
                max={10}
                curr={9}
                width={100}
              />
            </dd>
          </dl>
          <dl>
            <dt>맛</dt>
            <dd>
              <Gauge
                max={10}
                curr={10}
                width={100}
              />
            </dd>
          </dl>
        </div>
      </article>
      <CommentArea
        targetPk={id}
        targetName="shopping"
        maxDepth={0}
        targetUserExposeType="real"
      />
    </ReviewWrapperDiv>
  )
});

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
  const {
    access,
    story
  } = useSelector(({orm, system: {session: {access}}}) => ({
    access,
    story: pickStorySelector(id as string)(orm) || {pending: true, extension: {}}
  }));
  const {
    pending,
    title,
    extension,
    products,
    images = []
  } = story;
  const {
    price,
    capacity,
    manufecturer,
    origin,
    delivery_fee,
    body_image,
  } = extension || {};

  React.useEffect(() => {
    dispatch(fetchShopThunk(id as string));
  }, []);

  // State
  const [imageOnIdx, setImageOnIdx] = React.useState(0);
  const [tabPosition, setTabPosition] = React.useState('static');

  // 결제 관련
  const [quantity, setQuantity] = React.useState(1);
  const [productId, setProductId] = React.useState('');
  const [optionIds, setOptionIds] = React.useState([]);

  if (pending) {
    return <Loading />;
  } else if (!title) {
    return <Page404 />;
  }

  let totalPrice = price;
  if (productId) {
    for (let i = 0, len = products.length; i < len; i++) {
      if (products[i].id === productId) {
        totalPrice += products[i].price;
        break;
      }
    }
  }
  totalPrice *= quantity;

  // TODO: 품절

  return (
    <Div>
      <OGMetaHead title={title || 'asfd'}/>
      <section className="basic-info clearfix">
        <div className="images">
          <BGImg
            className="img"
            img={images[imageOnIdx] && images[imageOnIdx].image}
          />
          <ul className="thumbnails">
            {images.map(({image}, idx) => (
              <li key={image}>
                <BGImg
                  className={classNames('img', {on: idx === imageOnIdx})}
                  onClick={() => setImageOnIdx(idx)}
                  img={image}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="basic-info-text">
          <div>
            <h2>{title}</h2>
          </div>
          <div>
            <p className="price-area">
              <span className="price">{numberWithCommas(totalPrice)}</span>
              <span className="unit">&nbsp;원</span>
              {totalPrice !== price && (
                <span className="base-price">&nbsp;(개당 가격: {numberWithCommas(totalPrice / quantity)})</span>
              )}
            </p>
          </div>
          <div>
            <table>
              <colgroup>
                <col width="30%"/>
                <col width="70%"/>
              </colgroup>
              <tr>
                <th>제조사</th>
                <td>{manufecturer}</td>
              </tr>
              <tr>
                <th>원산지</th>
                <td>{origin}</td>
              </tr>
              <tr>
                <th>선택사항</th>
                <td>
                  <SelectBox
                    option={[
                      {
                        label: '상품 선택',
                        value: '',
                        disabled: true
                      },
                      ...products.map(({name, text, price, id}) => ({
                        label: `${name}${text ? `(${text})` : ''}${!!price ? `(+${price})` : ''}`,
                        value: id
                      }))
                    ]}
                    value={productId}
                    onChange={value => setProductId(value)}
                  />
                </td>
              </tr>
              {/*<tr>*/}
              {/*  <th>옵션</th>*/}
              {/*  <td>1</td>*/}
              {/*</tr>*/}
              <tr>
                <th>배송비</th>
                <td>{delivery_fee}</td>
              </tr>
            </table>
          </div>
          <div className="order-btn-group">
            <div>
              <Counter 
                min={1}
                max={capacity}
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
                  new Api({token: access, baseURL: BASE_URL}).getAxios().post(`/shopping/${id}/cart/`, {
                    product: productId,
                    options: optionIds,
                    quantity
                  }).then(res => {
                    if (res.status === 201) {
                      confirm('장바구니에 담겼습니다. 이동하시겠습니까?') && router.push('/shopping/cart');
                    }
                  })
                }}
              >
                장바구니 담기
              </button>
            </div>
            <div>
              <button className="order-btn buy">바로 구매</button>
            </div>      
          </div>
        </div>
      </section>
      <div className="tab-waypoint">
        <Waypoint
          scrollableAncestor={window}
          onLeave={(arg) => {
            console.log(arg);
            setTabPosition('fixed');
          }}
          onEnter={(arg) => {
            console.log(arg);
            setTabPosition('static');
          }}
        >
          <div/>
        </Waypoint>
      </div>
      <div className="tabs">
        <ul className={tabPosition}>
          <li className={classNames({on: hash === '#shopping-info'})}>
            <a href="#shopping-info">상품정보</a>
          </li>
          {/*<li className={classNames({on: hash === '#review-info'})}>*/}
          {/*  <a href="#review-info">상품후기</a>*/}
          {/*</li>*/}
          <li className={classNames({on: hash === '#qna-info'})}>
            <a href="#qna-info">상품문의</a>
          </li>
          <li className={classNames({on: hash === '#delivery-info'})}>
            <a href="#delivery-info">배송/교환/반품</a>
          </li>
        </ul>
      </div>
      <section className="tab-section shopping-info">
        <h3>
          상품정보
          <span id="shopping-info"/>
        </h3>
        <h4>필수표기정보</h4>
        <table>
          <colgroup>
            <col width="150px"/>
            <col width="auto"/>
            <col width="150px"/>
            <col width="auto"/>
          </colgroup>
          <tbody>
          <tr>
            <th>제조국</th>
            <td>이탈리아</td>
            <th>제조국</th>
            <td>이탈리아</td>
          </tr>
          </tbody>
        </table>
        {body_image && (
          <img src={body_image} alt="상품 상세 정보 이미지"/>
        )}
      </section>
      {/*<section className="tab-section review-info" id="review-info">*/}
      {/*  <h3>상품후기</h3>*/}
      {/*  <GoodsReview*/}
      {/*    id={id}*/}
      {/*  />*/}
      {/*</section>*/}
      <section className="tab-section qna-info">
        <h3>
          상품문의
          <span id="qna-info" />
        </h3>
        <ReverseCommentArea
          targetPk={id}
          targetName="shopping"
          maxDepth={0}
          targetUserExposeType="real"
        />
      </section>
      <section className="tab-section delivery-info">
        <h3>
          배송/교환/반품
          <span id="delivery-info"/>
        </h3>
        <h4>배송정보</h4>
        <table>
          <colgroup>
            <col width="150px"/>
            <col/>
          </colgroup>
          <tbody>
          <tr>
            <th>교환 가능 기간</th>
            <td>결제 후 30분</td>
          </tr>
          <tr>
            <th>반품 가능 기간</th>
            <td>결제 후 1분</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section className="refund-info">
      </section>
    </Div>
  );
};

export default React.memo(ShoppingDetail);

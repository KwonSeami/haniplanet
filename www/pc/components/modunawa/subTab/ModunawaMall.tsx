import * as React from 'react';
import {numberWithCommas} from '../../../src/lib/numbers';
import {staticUrl} from '../../../src/constants/env';
import A from '../../UI/A';
import SimpleCommentArea from '../../comment/SimpleCommentArea';
import styled from 'styled-components';
import {$FLASH_WHITE, $BORDER_COLOR, $POINT_BLUE, $FONT_COLOR, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';

interface MallProductProps {
  mall_name: string;
  mall_url?: string;
  price: number;
  price_based_on: string | number;
  delivery_price: number;
  delivery_price_free_condition: string;
}

const MallProductUl = styled.div`
  li {
    background-color: ${$FLASH_WHITE};
    border-top: 1px solid ${$BORDER_COLOR};
    transition: all 0.3s;
    
    &:hover {
      background-color: #F0F2F4;
      
      li:first-child p {
        text-decoration: underline;
      }
    }

    dl {
      display: flex;
      align-items: center;
      height: 59px;
      padding: 0 20px;
      dt {
        font-weight: normal;
      }      
      dt,dd {
        position: relative;
        flex: 1 0 auto;

        &:nth-child(even) {
          text-align: right;
        }

        &:first-child {
          flex: 0 0 170px;

          p {
            width: 139px;
            transition: all 0.3s;
            ${fontStyleMixin({
              size: 14,
              weight: '600'
            })};
          }
        }

        &.price {
          flex: 0 0 170px;
          padding-right: 31px;
          
          p {
            font-size: 14px;

            span {
              color: ${$POINT_BLUE};
            }
          }

          span {
            margin-top: -2px;
          }
          
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            right: 15px;
            width: 1px;
            height: 10px;
            transform: translateY(-50%);
            border-right: 1px solid ${$BORDER_COLOR};
          }
        }

        &.delivery {
          img {
            vertical-align: -5px;
            margin-right: 2px;
            width: 15px;
            height: 15px;
          }

          p {
            display: inline-block;
            vertical-align: middle;
            color: #999;

            span {
              margin: 3px 0 0 2px;
              color: ${$FONT_COLOR};
            }
          }
          span {
            margin-top: 2px;
          }
        }
        
        > span {
          display: block;
          ${fontStyleMixin({
            size: 11,
            color: $TEXT_GRAY
          })};
        }

        span.link {
          display: inline-block;
          padding: 1.5px 8px 2.5px;
          color: ${$FONT_COLOR};
          border: 1px solid ${$BORDER_COLOR};
          background-color: ${$WHITE};

          img {
            vertical-align: 1px;
            margin-left: 1px;
            width: 7px;
            height: 7px;
          }
        }
      }
    }
  }
`

const MallProductData = ((
  {
    mall_name,
    mall_url,
    price,
    price_based_on,
    delivery_price,
    delivery_price_free_condition,
  }:MallProductProps) => (
  <div>
    <dl>
      <dt>
        <p className="ellipsis">{mall_name}</p>
      </dt>
      <dd className="price">
        <p>
          <span>{numberWithCommas(price)}</span>원
        </p>
        <span>{price_based_on}</span>
      </dd>
      <dd className="delivery">
        <img
          src={staticUrl('/static/images/icon/icon-story-delivery.png')}
          alt="배송"
        />
        <p>
          배송비
          <span>
            {delivery_price
              ? numberWithCommas(delivery_price)
              : '무료'}
          </span>
        </p>
        <span>{delivery_price_free_condition}</span>
      </dd>
      <dd>
        {mall_url && (
          <span className="link">
            보러가기
            <img
              src={staticUrl('/static/images/icon/arrow/icon-story-shortcut.png')}
              alt="보러가기"
            />
          </span>
        )}
      </dd>
    </dl>
  </div>
))

const ModunawaMall = ({id, price_comparisons}) => {
  return (
    <div className="shop-contents">
      <SimpleCommentArea
        targetPk={id}
        commentType="mall"
        maxDepth={0}
        targetUserExposeType="real"
        placeholder="추천 쇼핑몰을 입력해주세요.(80자 이내)"
        maxLength={80}
      >
        <MallProductUl>
          {price_comparisons.map((data,idx) => (
            <li>
            {data.mall_url ? (
              <A to={data.mall_url && (
                typeof window !== 'undefined'
                && window.encodeURI(data.mall_url.url)
              )}
                 newTab
              >
                <MallProductData
                  idx={idx}
                  {...data}
                />
              </A>
            ) : (
              <MallProductData
                idx={idx}
                {...data}
              />
            )}
            </li>
          ))}
        </MallProductUl>
      </SimpleCommentArea>
    </div>
  );
};

export default React.memo(ModunawaMall);
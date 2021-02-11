import * as React from 'react';
import {numberWithCommas} from '../../../src/lib/numbers';
import {staticUrl} from '../../../src/constants/env';
import A from '../../UI/A';
import SimpleCommentArea from '../../comment/SimpleCommentArea';
import styled from 'styled-components';
import {$FLASH_WHITE, $BORDER_COLOR, $POINT_BLUE, $FONT_COLOR, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import { fontStyleMixin } from '../../../styles/mixins.styles';

interface MallProductProps {
  mall_name: string;
  mall_url?: string;
  price: number;
  price_based_on: string | number;
  delivery_price: number;
  delivery_price_free_condition: string;
}

const MallProductUl = styled.div`
  & > li {
    min-height: 85px;
    padding: 10px 15px;
    background-color: ${$FLASH_WHITE};
    border-top: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
    
    ul {
      li {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 50%;

        &:first-child {
          h4 {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding-top: 2px;
            ${fontStyleMixin({
              size: 16,
              weight: '600'
            })};
          }
          
          img {
            vertical-align: -6px;
            margin-right: 3px;
            width: 15px;
            height: 15px;
          }

          p {
            display: inline-block;
            vertical-align: middle;
            color: #999;
            margin-top: 3px;

            span {
              margin: 3px 0 0 2px;
              color: ${$FONT_COLOR};
            }
          }

          span {
            margin: 1px 0 0;
          }
        }

        &:last-child{
          text-align: right;
          
          p {
            font-size: 16px;

            span {
              color: ${$POINT_BLUE};
            }
          }
        }
        
        > span {
          display: block;
          margin: 2px 0;
          ${fontStyleMixin({
            size: 11,
            color: $TEXT_GRAY
          })};
        }

        span.link {
          margin: 4px 0 0;
          color: ${$FONT_COLOR};
          text-decoration: underline;

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
    <ul>
        <li>
          <h4>{mall_name}</h4>
          <img
            src={staticUrl('/static/images/icon/icon-story-delivery.png')}
            alt="배송"
          />
          <p>
            배송비
            <span>{delivery_price ? `${numberWithCommas(delivery_price)}원` : '무료'}</span>
          </p>
          <span>{delivery_price_free_condition}</span>
        </li>
        <li>
          <p>
            <span>{numberWithCommas(price)}</span>
            원
          </p>
          <span>{price_based_on}</span>
          {mall_url && (
            <span className="link">
              보러가기
              <img
                src={staticUrl('/static/images/icon/arrow/icon-story-shortcut.png')}
                alt="보러가기"
              />
            </span>
          )}
        </li>
      </ul>
  </div>
))

const ModunawaMall = ({id, price_comparisons}) => {
  return (
    <div className="shop-contents">
      <SimpleCommentArea
        targetPk={id}
        targetName="story"
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
              <A
                to={data.mall_url && (
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
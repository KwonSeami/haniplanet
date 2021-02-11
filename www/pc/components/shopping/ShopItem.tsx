import * as React from 'react';
import {staticUrl} from '../../src/constants/env';
import cn from 'classnames';
import Link from 'next/link';
import {numberWithCommas} from "../../src/lib/numbers";
import {ShoppingItemLi} from './style/goods';
import isEmpty from 'lodash/isEmpty';
import {isPeriodDate} from '../../src/lib/date';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import StoryApi from '../../src/apis/StoryApi';
import {SHINHAN_DISCOUNT_PERCENTAGE} from '../../src/constants/shopping';


export interface IGoodsItemProps {
  id: HashId;
  title: string;
  status: string;
  is_follow: boolean;
  is_sold_out: boolean;
  products: IProduct[];
  goods: IGoods;
  images: string | string[];
  onWish: (isFollow: boolean, data: any) => void;
}

interface IGoods {
  body_image: string[];
  delivery_fee: number;
  is_expose_card_price: boolean;
  manufacturer?: string;
}

interface IProduct {
  id: HashId;
  name: string;
  text?: string;
  price: number;
  capacity: number;
  sale_price?: number;
  sale_start_at?: string; 
  sale_end_at?: string;
  user_types: IUser[]
}

interface IUser {
  name: string;
}

interface ITag {
  id: HashId;
  name: string;
  avatar: string;
  is_follow: boolean;
}

const ShopItem: React.FC<IGoodsItemProps> = ({
    id,
    title,
    is_follow,
    is_sold_out,
    goods,
    products,
    images,
    onWish,
  }
) => {
  const {
    price,
    sale_price,
    sale_start_at,
    sale_end_at,
  } = products[0] || {};
  const {
    manufacturer,
    is_expose_card_price
  } = goods || {};

  const storyApi = useCallAccessFunc(access => new StoryApi(access));
  const isSalePeriod = React.useMemo(() => isPeriodDate(sale_start_at, sale_end_at), []);
  const goodsPrice = isSalePeriod && sale_price ? sale_price : price;

  const image = React.useMemo(() => {
    if (isEmpty(images)) {
      return '';
    }

    const {image} = typeof images[0] === 'string'
      ? JSON.parse(images[0])
      : images[0];
    return image;
  }, [images]);

  return (
    <ShoppingItemLi imgSrc={image}>
      <Link
        href="/shopping/goods/[id]"
        as={`/shopping/goods/${id}`}
      >
        <a>
          {onWish && (
            <div
              className={cn('followed', { on: is_follow })}
              onClick={e => {
                e.preventDefault();
                storyApi.follow(id)
                  .then(res => {
                    if (res.status === 200) {
                      onWish(!is_follow, {is_follow: !is_follow});
                    }
                  });
              }}
            >
              {is_follow ? (
                <img
                  src={staticUrl('/static/images/icon/icon-heart-on.png')}
                  alt="heart"
                />
              ) : (
                <img
                  src={staticUrl('/static/images/icon/icon-heart-off.png')}
                  alt="heart"
                />
              )}
            </div>
          )}
          <div className="thumbnail">
            <div className="img"></div>
            {is_sold_out && (
              <span
                className="status-label"
              >
                품절
              </span>
            )}
          </div>
          <div className="contents">
            <h3>{title}</h3>
            {manufacturer && (
              <small>{manufacturer}</small>
            )}
            <div className="price">
              {(isSalePeriod && sale_price) && (
                <p>
                  <span className="percentage">{100-Math.round((sale_price/price) * 100)}%</span>
                  <del>
                    {numberWithCommas(price)}
                    <span className="unit">원</span>
                  </del>
                </p>
              )}
              <p>
                <em>{numberWithCommas(goodsPrice)}</em>
                <span className="unit">원</span>
              </p>
            </div>
            <div className="price">
              {is_expose_card_price ? (
                <>
                  <p className="text point">한의플래닛 카드할인</p>
                  <p>
                    <span>
                      <em className="point">{numberWithCommas(goodsPrice-(goodsPrice*SHINHAN_DISCOUNT_PERCENTAGE))}</em>
                      <span className="unit point">원</span>
                    </span>
                    <i>+{SHINHAN_DISCOUNT_PERCENTAGE*100}%</i>
                  </p>
                </>
              ) : (
                <p className="text point">한의플래닛 카드결제 시 5% 할인</p>
              )}
            </div>
          </div>
        </a>
      </Link>
    </ShoppingItemLi>
  )
};

export default React.memo(ShopItem);

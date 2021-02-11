import * as React from 'react';
import Link from "next/link";
import {numberWithCommas} from "../../src/lib/numbers";
import {isPeriodDate} from '../../src/lib/date';
import {CartThumbnailDiv} from './style/order';
import {ICartItemProps} from '../../src/@types/shopping';

const StaticCartItem: React.FC<ICartItemProps> = ({
  id,
  thumbnail,
  storyId,
  title,
  name,
  quantity,
  price,
  sale_price,
  sale_start_at,
  sale_end_at,
  delivery_fee,
}) => {
  const isSalePeriod = React.useMemo(() => isPeriodDate(sale_start_at, sale_end_at), []);
  return (
    <tr>
      <td className="thumbnail">
        <Link 
          href="/shopping/goods/[id]"
          as={`/shopping/goods/${storyId}`}
        >
          <a>
            <CartThumbnailDiv
              size={150}
              image={thumbnail}
            />
          </a>
        </Link>
      </td>
      <td className="info">
        <Link 
          href="/shopping/goods/[id]"
          as={`/shopping/goods/${storyId}`}
        >
          <a>
            <em>{title}</em>
            {name && (
              <p>{name}</p>
            )}
          </a>
        </Link>
      </td>
      <td>{quantity}</td>
      <td>{numberWithCommas(isSalePeriod && sale_price ? sale_price : price)}&nbsp;원</td>
      <td>{numberWithCommas((isSalePeriod && sale_price ? sale_price : price) * quantity)}&nbsp;원</td>
      <td>{delivery_fee ? `${numberWithCommas(delivery_fee)}원` : '무료'}</td>
    </tr>
  )
};

StaticCartItem.displayName = 'StaticCartItem';
export default React.memo(StaticCartItem);
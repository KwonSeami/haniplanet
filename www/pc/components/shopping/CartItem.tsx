import * as React from 'react';
import {numberWithCommas} from "../../src/lib/numbers";
import Counter from "../../components/UI/Counter";
import Link from "next/link";
import CheckBox from '../UI/Checkbox1/CheckBox';
import {CartThumbnailDiv} from './style/order';
import {isPeriodDate} from '../../src/lib/date';
import {ICartItemProps} from '../../src/@types/shopping';

interface ICartItem extends ICartItemProps {
  checked: boolean;
  min_amount: number;
  max_amount: number;
  onChangeChecked: () => void;
  onChangeData: (data: any) => void;
}

const CartItem: React.FC<ICartItem> = ({
  id,
  thumbnail,
  storyId,
  title,
  name,
  text,
  quantity: _quantity,
  min_amount,
  max_amount,
  price,
  sale_price,
  sale_start_at,
  sale_end_at,
  delivery_fee,
  checked,
  onChangeChecked,
  onChangeData
}) => {
  const [quantity, setQuantity] = React.useState(_quantity);
  const isSalePeriod = React.useMemo(() => isPeriodDate(sale_start_at, sale_end_at), []);

  return (
    <tr>
      <td className="checkbox">
        <CheckBox
          name={id}
          checked={checked}
          onChange={onChangeChecked}
        />
      </td>
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
            <p>{name} {text}</p>
          </a>
        </Link>
      </td>
      <td>
        <Counter
          value={quantity}
          min={min_amount}
          max={max_amount}
          onChange={value => setQuantity(value)}
        />
        <button
          type="button"
          className="btn-mini"
          onClick={() => {
            onChangeData({quantity});
          }}
        >
          변경
        </button>
      </td>
      <td>{numberWithCommas(isSalePeriod && sale_price ? sale_price : price)}&nbsp;원</td>
      <td>{numberWithCommas((isSalePeriod && sale_price ? sale_price : price) * quantity)}&nbsp;원</td>
      <td>{delivery_fee ? `${numberWithCommas(delivery_fee)}원` : '무료'}</td>
    </tr>
  )
};

CartItem.displayName = 'CartItem';
export default React.memo(CartItem);
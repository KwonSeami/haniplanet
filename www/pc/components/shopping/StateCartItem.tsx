import * as React from 'react';
import Link from "next/link";
import {numberWithCommas} from "../../src/lib/numbers";
import {SHOPPING_STATUS, PAYMENT_STATUS} from '../../src/constants/payment';
import A from '../UI/A';
import {useDispatch} from 'react-redux';
import {pushPopup} from '../../src/reducers/popup';
import ExchangePopup from '../layout/popup/ExchangePopup';
import {ICartItemProps} from '../../src/@types/shopping';
import {CartThumbnailDiv} from './style/order';
import CancelPopup from '../layout/popup/CancelPopup';
 
interface ICartItem extends ICartItemProps {
  userId: HashId;
  status: string;
  progress: string;
  track_id?: string;
  is_able_to_cancel: boolean;
  extend_to: string;
  carrier: null | {
    carrier_id: string;
    name: string;
    tel: string;
  }
};

export const getPaymentState = (status: string, progress?: string) => {
  if(progress) {
    const targetProgress = 
      status === 'ok' 
        ? ['ok_pending', 'ok_preparing', 'ok_sending', 'ok_delivered', 'ok_purchase_fix']
        : status === 'exchange' 
          ? ['exchange_pending', 'exchange_ongoing', 'exchange_done', 'exchange_cancel']
          : ['refund_pending', 'refund_ongoing', 'refund_cancel', 'refund_done'];
          
    if(targetProgress.includes(progress)) {
      return SHOPPING_STATUS[progress];
    }
  } else {
    return PAYMENT_STATUS[status] || ''
  }
}

const StateCartItem: React.FC<ICartItem> = ({
  id: applyPk,
  thumbnail,
  storyId,
  userId,
  title,
  name,
  quantity,
  price,
  delivery_fee,
  track_id,
  is_able_to_cancel,
  status,
  progress,
  carrier,
  extend_to
}) => {
  const dispatch = useDispatch();
  const {
    carrier_id 
  } = carrier || {}

  const LinkType = extend_to === 'meetup' ? `/meetup/${storyId}` : `/shopping/goods/${storyId}`

  return (
    <tr>
      <td className="thumbnail">
        <Link 
          href={LinkType}
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
          href={LinkType}
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
      <td>{numberWithCommas(price)}&nbsp;원</td>
      <td>{numberWithCommas(price * quantity)}&nbsp;원</td>
      <td>{delivery_fee ? `${numberWithCommas(delivery_fee)}원` : '무료'}</td>
      <td className="state">
        {getPaymentState(status, progress)}
        {is_able_to_cancel && (
          <div>
            {extend_to === 'goods' && (
              <button 
                className="btn"
                onClick={() => {
                  dispatch(pushPopup(ExchangePopup, {
                    userId, 
                    applyPk, 
                    destroyType: 'exchange'
                  }));
                }}
              >
                교환
              </button>
            )}
            <button
              className="btn"
              onClick={() => {
                if(extend_to === 'goods') {
                  dispatch(pushPopup(ExchangePopup, {
                    userId, 
                    applyPk,
                    destroyType: 'refund'
                  }));
                } else {
                  dispatch(pushPopup(CancelPopup, {
                    myId: userId,
                    applyPk
                  }))
                }
              }}
            >
              환불
            </button>
            {(carrier_id && track_id) && (
              <A
                to={`https://tracker.delivery/#/${carrier_id}/${track_id.replace(/-/g, '')}`}
                className="btn btn-black"
                newTab
              >
                배송조회
              </A>
            )}
          </div>
        )}
      </td>
    </tr>
  )
};

StateCartItem.displayName = 'StateCartItem';
export default React.memo(StateCartItem);

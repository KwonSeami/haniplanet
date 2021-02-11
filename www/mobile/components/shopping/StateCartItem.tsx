import * as React from 'react';
import {numberWithCommas} from "../../src/lib/numbers";
import {SHOPPING_STATUS, PAYMENT_STATUS} from '../../src/constants/payment';
import A from '../UI/A';
import {useDispatch} from 'react-redux';
import {pushPopup} from '../../src/reducers/popup';
import RefundPopup from '../layout/popup/RefundPopup';
import {HashId} from '@hanii/planet-types';
import {DetailProductLi} from '../payment/style';
import {staticUrl} from '../../src/constants/env';
import CancelPopup from '../layout/popup/CancelPopup';

interface ICartItem {
  id: HashId;
  storyId: string;
  userId: HashId;
  thumbnail?: string;
  title: string;
  name: string;
  quantity: number;
  price: number;
  delivery_fee: number;
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

  return (
    <DetailProductLi>
      <dl>
        <dt>
          {title}
          <i>
            {getPaymentState(status, progress)}
          </i>
        </dt>
        <dd>
          <figure>
            <div className="thumbnail">
              <img src={thumbnail || staticUrl('/static/images/banner/no-image.png')}/>
            </div>
            <figcaption className="info">
              <dl>
                <dt>상품 명</dt>
                <dd>{title}</dd>
              </dl>
              <dl>
                <dt>결제 금액</dt>
                <dd>{numberWithCommas(price * quantity)} 원</dd>
              </dl>
            </figcaption>
          </figure>
          <div className="detail">
            {name && (
              <dl>
                <dt>옵션 정보</dt>
                <dd>{name}</dd>
              </dl>
            )}
            <dl>
              <dt>상품 가격</dt>
              <dd>
                {numberWithCommas(price)} 원
              </dd>
            </dl>
            <dl>
              <dt>배송비</dt>
              <dd>{delivery_fee ? `${numberWithCommas(delivery_fee)}원` : '무료'}</dd>
            </dl>
            <dl>
              <dt>수량</dt>
              <dd>{quantity} 개</dd>
            </dl>
            <dl>
              <dt>총 가격</dt>
              <dd>
                {numberWithCommas(price * quantity)} 원
              </dd>
            </dl>
            <div className="btns">
              {is_able_to_cancel && (
                <>
                  {extend_to === 'goods' && (
                    <button 
                      className="btn"
                      onClick={() => {
                        dispatch(pushPopup(RefundPopup, {
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
                        dispatch(pushPopup(RefundPopup, {
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
                </>
              )}
              {(carrier_id && track_id) && (
                <A
                  to={`https://tracker.delivery/#/${carrier_id}/${track_id}`}
                  className="btn btn-black"
                  newTab
                >
                  배송조회
                </A>
              )}
            </div>
          </div>
        </dd>
      </dl>
    </DetailProductLi>
  )
};

StateCartItem.displayName = 'StateCartItem';
export default StateCartItem;
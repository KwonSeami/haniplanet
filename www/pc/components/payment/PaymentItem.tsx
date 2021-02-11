import React from 'react';
import {getPaymentState} from '../shopping/StateCartItem';
import CroppedImage from '../CroppedImage';
import A from '../UI/A';
import {PaymentItemLi} from './style';
import {numberWithCommas} from '../../src/lib/numbers';
import {staticUrl} from '../../src/constants/env';
import isEmpty from 'lodash/isEmpty';
import {pushPopup} from '../../src/reducers/popup';
import ExchangePopup from '../layout/popup/ExchangePopup';
import {ITrackData} from '../../src/@types/payment';
import {HashId} from '@hanii/planet-types';
import {useDispatch} from 'react-redux';
import CancelPopup from '../layout/popup/CancelPopup';
import Link from 'next/link';

interface IPaymentItemProps {
  id: string;
  merchant_uid: string;
  storyId: HashId;
  userId: string;
  title: string;
  name: string;
  quantity: number;
  price: number;
  images: string[];
  status: string;
  track: ITrackData;
  extend_to: string;
  is_able_to_cancel: boolean;
}


const PaymentItem: React.FC<IPaymentItemProps> = ({
  id,
  storyId,
  merchant_uid,
  userId,
  title,
  name,
  quantity,
  price,
  images,
  status,
  track,
  is_able_to_cancel,
  extend_to
}) => {
  const dispatch = useDispatch();
  const image = React.useMemo(() => {
    if(isEmpty(images)) return '';
    const [imgStr] = images;
    const imgObj = JSON.parse(imgStr) || {};
    return imgObj.image || '';
  }, [images]);

  const {
    track_id,
    progress,
    carrier
  } = track || {};
  
  const {
    carrier_id
  } = carrier || {};

  return (
    <PaymentItemLi>
      <table>
        <td className="img">
          <Link
            href="/payment/[id]"
            as={`/payment/${merchant_uid}`}
          >
            <a>
              <CroppedImage
                alt="썸네일"
                className=""
                size={150}
                src={!!image ? image : staticUrl('/static/images/banner/no-image.png')}
              />    
            </a>
          </Link>
        </td>
        <td className="title">          
          <Link
            href="/payment/[id]"
            as={`/payment/${merchant_uid}`}
          >
            <a>
              <h4 className="ellipsis">{title}</h4>
              <p className="ellipsis">{name}</p>
            </a>
          </Link>
        </td>
        <td className="quantity">{quantity}개</td>
        <td className="price">{numberWithCommas(price)}&nbsp;원</td>
        <td className="state">
          <p>{getPaymentState(status, progress)}</p>
          {(carrier_id && track_id) && (
            <A
              to={`https://tracker.delivery/#/${carrier_id}/${track_id}`}
              className="btn btn-black"
              newTab
            >
              배송조회
            </A>
          )}
          {is_able_to_cancel && (
            <div>
              {extend_to === 'goods' && (
                <button
                  onClick={() => {
                    dispatch(pushPopup(ExchangePopup, {
                      userId, 
                      applyPk: id,
                      destroyType: 'exchange'
                    }))
                  }}
                >
                  교환
                </button>
              )}
              <button
                onClick={() => {
                  dispatch(pushPopup(extend_to === 'goods' 
                      ? ExchangePopup
                      : CancelPopup, 
                    {
                      userId, 
                      applyPk: id,
                      destroyType: 'refund'
                    }
                  ));
                }}
              >
                환불
              </button>
            </div>
          )}
        </td>
      </table>
    </PaymentItemLi>
  )
};

export default React.memo(PaymentItem);
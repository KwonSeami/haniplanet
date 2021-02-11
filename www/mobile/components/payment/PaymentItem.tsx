import * as React from 'react';
import Link from 'next/link';
import {IPaymentData} from '../../src/@types/payment';
import {toDateFormat} from '../../src/lib/date';
import {numberWithCommas} from '../../src/lib/numbers';
import {LabelLi, PaymentListInfoUl, PaymentListLi, PaymentTitle, PriceLi} from './style';
import {getPaymentState} from '../shopping/StateCartItem';

const PaymentItem:React.FC<IPaymentData> = ({
  id,
  merchant_uid,
  title,
  price,
  status,
  payment,
  track
}) => {
  const {
    created_at
  } = payment || {};
  const {
    progress
  } = track || {};
  return (
    <PaymentListLi key={id}>
      <Link href={`/payment/${merchant_uid}`}>
        <a>
          <PaymentTitle>
            <span>{toDateFormat(created_at, 'YYYY-MM-DD')}</span>
            {title}
          </PaymentTitle>
          <PaymentListInfoUl className="clearfix">
            <PriceLi>{numberWithCommas(price)}원</PriceLi>
            <LabelLi status={status}>
              {getPaymentState(status, progress)}
            </LabelLi>
          </PaymentListInfoUl>
        </a>
      </Link>
    </PaymentListLi>
  )
};

PaymentItem.displayName = 'PaymentItem';

export default React.memo(PaymentItem);
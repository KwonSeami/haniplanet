import React from 'react';
import {staticUrl} from '../../src/constants/env';
import {PaymentTabDiv} from '../shopping/style/payment';
import cn from 'classnames';

const PAYMENT_STATUS = {
  default: [
    {key: 'apply_statuses', value: 'refund', label: '취소/교환/환불'}
  ],
  goods: [
    {key: 'track_progresses', value: 'ok_sending', label: '배송중'},
    {key: 'track_progresses', value: 'ok_delivered', label: '배송완료'}, 
    {key: 'apply_statuses', value: 'refund', label: '취소/교환/환불'}
  ]
}

interface IStatusData {
  key?: string;
  value: string;
  label: string;
}

interface IProps {
  status?: string;
  extend_to: string;
  onClick: (data: IStatusData) => void;
};

const PaymentTabMenu: React.FC<IProps> = ({
  status = '',
  extend_to = 'goods',
  onClick
}) => {
  
  const [activeStatus, setActiveStatus] = React.useState('');

  const tabMenus = [
    {value: '', label: '전체'},
    ...PAYMENT_STATUS[extend_to === 'goods' ? extend_to : 'default']
  ];
  
  React.useEffect(() => {
    setActiveStatus(status);
  }, [status]);

  return (
    <PaymentTabDiv className="tab-menu">
      <ul className="clearfix pointer">
        {tabMenus.map(props => {
          const {
            value, 
            label
          } = props;

          return (
            <li
              key={label}
              onClick={() => onClick && onClick(props)}
              className={cn({
                on: activeStatus === value
              })}
            >
              <i>
                <img
                  src={staticUrl(`/static/images/icon/icon-payment-${value || 'all'}${(activeStatus === value) ? '-on' : ''}.png`)}
                  title={label}
                />
              </i>
              <p>{label}</p>
            </li>
          )
        })}
      </ul>
    </PaymentTabDiv>
  )
};

export default React.memo(PaymentTabMenu);
import * as React from 'react';
import cn from 'classnames';
import PaymentAgreement from './PaymentAgreement';
import PrivacyPolicy from './PrivacyPolicy';
import Terms from './Terms';
import Tabs, {useTabParams} from '../../components/UI/tab/Tabs';
import PaidPayment from './PaidPayment';
import OnclassTerms from './OnclassTerms';
import AssociatedCard from './AssociatedCard';

interface Props {
  className?: string;
}

const POLICY_INDEX = [
  {label: '개인정보 처리방침', value: 'privacy'},
  {label: '이용약관', value: 'terms'},
  {label: '세미나모임 이용규정', value: 'payment'},
  {label: '온라인 강의 이용규정', value: 'onclass'},
  {label: '유료 서비스 이용약관', value: 'paidPayment'},
  {label: '제휴카드 안내/신청', value: 'associatedCard'},
];

const TermList = React.memo<Props>(({className}) => {
  const {currentTab, replaceTab} = useTabParams(
    'tab',
    POLICY_INDEX.map(({value}) => value)
  );

  return (
    <section className={className}>
      <ul className="tab clearfix">
        {POLICY_INDEX.map(({label, value}) => (
          <li
            key={value}
            className={cn({on: currentTab === value})}
            onClick={() => replaceTab(value)}
          >
            {label}
          </li>
        ))}
      </ul>
      <Tabs
        currentTab={currentTab}
        propsKey="tab"
      >
        <PrivacyPolicy tab="privacy"/>
        <Terms tab="terms"/>
        <PaymentAgreement tab="payment"/>
        <OnclassTerms tab="onclass"/>
        <PaidPayment tab="paidPayment"/>
        <AssociatedCard tab="associatedCard"/>
      </Tabs>
    </section>
  );
});

TermList.displayName = 'TermList';
export default TermList;

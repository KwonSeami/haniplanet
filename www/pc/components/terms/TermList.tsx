import * as React from 'react';
import cn from 'classnames';
import PaymentAgreement from './PaymentAgreement';
import PrivacyPolicy from './PrivacyPolicy';
import Terms from './Terms';
import Tabs, {useTabParams} from '../../components/UI/tab/Tabs';
import PaidPayment from './PaidPayment';
import OnclassTerms from './OnclassTerms';
import AssociatedCard from './AssociatedCard';
import ReactCustomSlick from '../common/ReactCustomSlick';
import styled from 'styled-components';
import {backgroundImgMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {$FONT_COLOR, $WHITE} from '../../styles/variables.types';

const SLICK_ARROW_WIDTH = 56;

const StyledSlider = styled(ReactCustomSlick)`
  width: 900px;
  height: 56px;
  margin: 0 auto;

  .slick-arrow {
    z-index: 2;
    width: ${SLICK_ARROW_WIDTH}px;
    height: 56px;
    border: 1px solid ${$FONT_COLOR};
    background-color: ${$WHITE};

    &::before {
      display: none;
    }

    &.slick-prev {
      left: 0;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/arrow/arrow-black-40.png'),
        size: '20px',
      })};
    }

    &.slick-next {
      right: 0;
      transform: translateY(-50%) rotate(180deg);
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/arrow/arrow-black-40.png'),
        size: '20px',
      })};
    }
  }

  .slick-list {
    width: calc(100% - ${SLICK_ARROW_WIDTH}px * 2 + 2px);
    margin: 0 auto;
  }
`;

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

const SLIDE_TO_SHOW = 3;

const sliderSettings = {
  className: 'modunawa-menu',
  speed: 300,
  arrows: true,
  slidesToScroll: 1,
  slidesToShow: SLIDE_TO_SHOW,
  infinite: false,
  draggable: false,
  swipe: false,
};

const TermList = React.memo<Props>(({className}) => {
  const {currentTab, replaceTab} = useTabParams(
    'tab',
    POLICY_INDEX.map(({value}) => value)
  );

  const initialIndex = React.useMemo(() => {
    const currIndex = POLICY_INDEX.findIndex(({value}) => value === currentTab);
    if (currIndex < 0) {
      return 0;
    } else if (currIndex > POLICY_INDEX.length - 3) {
      return (POLICY_INDEX.length - 3);
    }
    return currIndex;
  }, [currentTab]);

  return typeof currentTab !== 'number' && (
    <section className={className}>
      <h2>약관 및 정책</h2>
      <div className="tab clearfix">
        <StyledSlider
          initialSlide={initialIndex}
          {...sliderSettings}
        >
          {POLICY_INDEX.map(({label, value}) => (
            <div
              className={cn('term-item', {on: currentTab === value})}
              key={value}
              onClick={() => replaceTab(value)}
            >
              {label}
            </div>
          ))}
        </StyledSlider>
      </div>
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

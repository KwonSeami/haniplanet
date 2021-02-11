import * as React from 'react';
import AssociatedCardWrapper from './styles/AssociatedCardWrapper';
import {staticUrl} from '../../src/constants/env';
import Button from '../inputs/Button';
import {$WHITE} from '../../styles/variables.types';
import A from '../UI/A';

interface Props {
  tab?: string;
  className?: string;
}

const AssociatedCard = React.memo<Props>(({className}) => (
  <AssociatedCardWrapper className={className}>
    <h2>
      <p>플래닛 마켓을 이용하는 가장 스마트한 방법</p>
      신한카드 X 한의플래닛 제휴카드!
    </h2>
    <div className="card-info">
      <div className="shinhancard-img-wrapper">
        <img
          src={staticUrl('/static/images/graphic/shinhancard.png')}
          alt=""
        />
      </div>
      <div className="info-text">
        <span>신한카드</span>
        <strong>한의플래닛 Simple Platinum #</strong>
        <p>전월 실적 없이 1% 캐시백!</p>
        <ul>
          <li>
            전가맹점 1% 캐시백
          </li>
          <li>
            대중교통 추가 0.7% 캐시백
          </li>
          <li>
            잔돈할인 월 10회
          </li>
        </ul>
        <A
          to="https://www.shinhancard.com/pconts/html/card/apply/credit/1196411_2207.html?EntryLoc1=TM5678&EntryLoc2=2988&empSeq=501[](url)"
          newTab
        >
          <Button
            size={{
              width: '250px',
              height: '52px'
            }}
            border={{
              radius: '0'
            }}
            font={{
              size: '16px',
              weight: 'bold',
              color: $WHITE
            }}
            backgroundColor="#6788ab"
          >
            제휴카드 자세히 보기
            <img
              src={staticUrl('/static/images/icon/arrow/icon-white-arrow.png')}
              alt=""
            />
          </Button>
        </A>
      </div>
    </div>
    <img
      src={staticUrl('/static/images/temp/associated-shinhancard-info.jpg')}
      alt="플래닛마켓 회원을 위한 신한카드, 한의플래닛 제휴이벤트. 첫번째, 플래닛마켓에서 한의플래닛 제휴카드 이용시 전월실적, 한도 조건없는 5% 즉시할인! 기간: 2020년 6월 5일~2023년 5월 10일. 두번째, 한의플래닛 Simple Platinum # 마이신한포인트 추가 적립! 이용실적 200만원 이상 0.3%, 300만원 이상 0.4%, 400만원 이상 0.5%, 월 최대 100만원 한도 내 적립. 기간: 2020년 6월 5일~2020년 12월 31일"
    />
    <div className="associated-notice">
      <p>유의사항</p>
      <ul className="associated-notice-top">
        <li>
          * 행사 기간은 한의플래닛과 신한카드의 사정에 따라 조기 종료 또는 연장될 수 있습니다.
        </li>
        <li>
          * 이벤트 #2. 마이신한포인트 추가 적립행사는 한의사 회원 대상입니다.
        </li>
        <li>
          * 마이신한포인트 추가 적립행사 이용실적 조건 및 적립 대상에서 아래 이용금액은 제외됩니다.
          <p>- 국세, 지방세, 4대보험, 자동차업종 이용금액</p>
          <span>(단, 국세 및 4대보험 이용시에도 카드 자체 캐시백 혜택은 제공됩니다.)</span>
        </li>
        <li>
          * 추가 포인트 적립은 해당월 1일부터 말일까지 카드 이용금액 중 적립 해당금액에 대하여 익월 말에 적립됩니다.
        </li>
        <li>
          * 포인트 적립일 기준 해당카드 탈회 및 신한카드 회원 탈회시 혜택 적용이 제외됩니다.
        </li>
        <li>
          * 한의플래닛 Simple Platinum# 카드의 연회비는 VISA 30,000원 | URS / UPI 27,000원 입니다. 
        </li>
      </ul>
      <ul className="associated-notice-bottom">
        <li>
          * 상품의 자세한 혜택 및 제한(이용)조건은 계약을 체결하기 전에 홈페이지, 상품설명서, 약관등을 확인하시기 바랍니다.
        </li>
        <li>
          * 연체이자율은 회원별,이용상품별 약정금리+ 최대 3%, 법정금리［24%］이내에서 적용 됩니다.
          <p>단, 연체 발생 시점에 약정금리가 없는 경우 아래와 같이 적용함.</p>
          - 일시불 거래 연체 시:거래발생 시점의 최소기간 (2개월)유이자 할부금리<br/>
          - 무이자 할부 거래 연체 시:거래발생 시점의 동일한 할부 계약 기간의 유이자 할부 금리
        </li>
        <li>
          * 신용카드 남용은 가계경제에 위협이 됩니다.
        </li>
        <li>
          * 여신금융상품 이용 시 귀하의 신용등급이 하락할수 있습니다.
        </li>
        <li>
          * 여신금융협회 심의필 제2020-C1h-04407호(2020.05.21)
        </li>
      </ul>
    </div>
  </AssociatedCardWrapper>
));

AssociatedCard.displayName = 'AssociatedCard';
export default AssociatedCard;

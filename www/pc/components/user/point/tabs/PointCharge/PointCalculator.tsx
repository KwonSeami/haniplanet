import * as React from 'react';
import cn from 'classnames';
import PointCalculatorArea from './PointCalculatorArea';
import {numberWithCommas} from '../../../../../src/lib/numbers';

const POINT_CALCULATOR_KOR = {
  CHARGE: '충전 예정 별',
  REFUND: '환급 예정 별',
};

const CALCULATE_COMPLETE_KOR = {
  CHARGE: '결제 완료 후',
  REFUND: '잔여 별',
};

const PAYMENT_POINT_KOR = {
  CHARGE: '예상 결제 금액',
  REFUND: '환급 예상 금액',
};

interface Props {
  className?: string;
  point: number;
  calculatedPoint: number;
  completePrice: number;
  type: 'CHARGE' | 'REFUND';
}

const PointCalculator = React.memo<Props>(props => {
  const {className, point, calculatedPoint, completePrice, type} = props;
  const paymentPoint = React.useMemo(() => {
    switch (type) {
      case 'CHARGE':
        return point + calculatedPoint;
      case 'REFUND':
        return point - calculatedPoint;
    }
  }, [type, point, calculatedPoint]);

  return (
    <PointCalculatorArea className={className}>
      <h3>결제 완료 후, 별을 확인해보세요.</h3>
      <ul className="calculate-list">
        <li>
          <dl>
            <dt>나의 별</dt>
            <dd>{numberWithCommas(point)}</dd>
          </dl>
        </li>
        <li className={cn("expected-point", {'expected-charge-point': type === 'CHARGE'})}>
          <dl>
            <dt>{POINT_CALCULATOR_KOR[type]}</dt>
            <dd>{numberWithCommas(calculatedPoint)}</dd>
          </dl>
        </li>
        <li className="payment-point">
          <dl>
            <dt>{CALCULATE_COMPLETE_KOR[type]}</dt>
            <dd>{numberWithCommas(paymentPoint)}</dd>
          </dl>
        </li>
      </ul>
      <p className="exchange-point">
        <strong>{PAYMENT_POINT_KOR[type]}</strong>
        <span className={cn({active: !!completePrice})}>
          {numberWithCommas(completePrice)}
        </span>원
      </p>
      <ul className="desc-list">
        {type === 'CHARGE' && (
          <>
            <li>※ 별 충전 시, <span>부가세 10%가 추가</span>된 금액이 결제됩니다.</li>
            <li>※ 별 충전 1회, 1일 최대 제한 금액은 없습니다.</li>
            <li>※ 환급가능한 1회 최소 별은 500별(4만원) / 1일 최대 별은 2500별(20만원)</li>
          </>
        )}
      </ul>
    </PointCalculatorArea>
  );
});

export default PointCalculator;

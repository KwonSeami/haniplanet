import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {$BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';

const RefundPolicyBox = styled.div`
  cursor: pointer;
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  padding: 20px 18px 20px 60px;
  border-radius: 2px;
  border: 2px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  &.on {
    color: ${$POINT_BLUE};
    border-color: ${$POINT_BLUE};

    h4, p {
      color: ${$POINT_BLUE};
    }
  }

  h4 {
    position: absolute;
    left: 14px;
    top: 20px;
    font-size: 17px;
    color: #b3c4ce;
    font-weight: 600;
  }

  p {
    padding-bottom: 10px;
    font-size: 12px;
    color: #999;
  }

  table {
    width: 50%; 
    float: left;
    border-top: 2px solid #b3c4ce;

    &:last-child {
      width: 100%;
      border-top: 0;
    }

    th, td {
      text-align: center;
      font-size: 12px;
      vertical-align: middle;
      font-weight: 400;
      padding: 5px 0;
      border-bottom: 1px solid ${$BORDER_COLOR};
    }

    th {
      background-color: #f3f4f7;
    }
  }
  
  &.disabled {
    cursor: default !important;
  }

  &:last-child table {
    width: 100%;
  }
`;

interface Props {
  disabled?: boolean;
  type: 'normal' | 'strict' | 'flex';
  onChange: (type: Props['type']) => void;
}

const RefundPolicyCard = React.memo<Props>(
  ({disabled, type, onChange}) => (
      <>
        <RefundPolicyBox
          className={cn('clearfix', {on: type === 'normal'}, disabled && 'disabled')}
          onClick={() => !disabled && onChange('normal')}
        >
          <h4>일반</h4>
          <p>
            (예시 : 8일이 강의 시작일일 경우, 8일 00:00분 이후부터는 환불 불가, 6일 00:00분 까지 50% 환불, 4일 00:00분 까지 80% 환불, 3일 23:59분 이전부터 100% 환불)
          </p>
          <table>
            <tr>
              <th>5일전</th>
              <th>4일전</th>
              <th>3일전</th>
            </tr>
            <tr>
              <td>100%환불</td>
              <td>80%환불</td>
              <td>80%환불</td>
            </tr>
          </table>
          <table>
            <tr>
              <th>2일전</th>
              <th>1일전</th>
              <th>강의 시작일</th>
            </tr>
            <tr>
              <td>50%환불</td>
              <td>50%환불</td>
              <td>환불불가</td>
            </tr>
          </table>
          <table>
            <tr>
              <th colSpan={6}>신청당일 전액환불 가능</th>
            </tr>
          </table>
        </RefundPolicyBox>
        <RefundPolicyBox
          className={cn('clearfix', {on: type === 'strict'}, disabled && 'disabled')}
          onClick={() => !disabled && onChange('strict')}
        >
          <h4>엄격</h4>
          <p>
            (예시 : 8일이 강의 시작일일 경우, 5일 00:00분 이후부터는 환불 불가, 2일 00:00분 까지 80% 환불, 1일 23:59분 이전부터 100% 환불)
          </p>
          <table>
            <tr>
              <th>7일전</th>
              <th>6일전</th>
              <th>5일전</th>
              <th>4일전</th>
            </tr>
            <tr>
              <td>100%환불</td>
              <td>80%환불</td>
              <td>80%환불</td>
              <td>80%환불</td>
            </tr>
          </table>
          <table>
            <tr>
              <th>3일전</th>
              <th>2일전</th>
              <th>1일전</th>
              <th>강의 시작일</th>
            </tr>
            <tr>
              <td>환불불가</td>
              <td>환불불가</td>
              <td>환불불가</td>
              <td>환불불가</td>
            </tr>
          </table>
          <table>
            <tr>
              <th colSpan={6}>신청당일 전액환불 가능</th>
            </tr>
          </table>
        </RefundPolicyBox>
        <RefundPolicyBox
          className={cn('clearfix', {on: type === 'flex'}, disabled && 'disabled')}
          onClick={() => !disabled && onChange('flex')}
        >
          <h4>유연</h4>
          <p>
            (예시 : 8일이 강의 시작일일 경우, 8일 00:00분 이후부터는 환불 불가, 7일 23:59분 이전부터 100% 환불)
          </p>
          <table>
            <tr>
              <th>-1일전</th>
              <th>강의시작일</th>
            </tr>
            <tr>
              <td>100%환불</td>
              <td>환불불가</td>
            </tr>
          </table>
          <table>
            <tr>
              <th colSpan={6}>신청당일 전액환불 가능</th>
            </tr>
          </table>
        </RefundPolicyBox>
      </>
    )
);

RefundPolicyCard.displayName = 'RefundPolicyCard';
export default RefundPolicyCard;
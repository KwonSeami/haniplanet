import * as React from 'react';
import {MeetupDetailUl, Table, OnClassRefundWrapper} from './common';
import MapShower from '../../../../components/inputs/MapShower';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';

const StyledMapShower = styled(MapShower)`
  width: 100%;
`;

interface Props {
  detail: boolean;
  teacher_info: string;
  refund_policy: string;
}

const MeetupDetailInfo = React.memo<Props>(
  (
    {
      address,
      detail,
      teacher_info,
      refund_policy,
      payment_info,
      coordinates,
      online_note,
      is_online_meetup,
      onclass_available_refund_days,
      products = [],
    },
  ) => {
    const refundPolicyText = React.useMemo(() => {
      switch (refund_policy) {
        case 'strict':
          return '엄격';
        case 'normal':
          return '일반';
        case 'flex':
          return '유연';
        default:
          return '없음'
      }
    }, [refund_policy]);
    const refundPolicyTable = React.useMemo(() => {
      switch (refund_policy) {
        case 'strict':
          return (
            <Table priceTable>
              <thead>
              <tr>
                <th>7일전</th>
                <th>6일전</th>
                <th>5일전</th>
                <th>4일전</th>
                <th>3일전</th>
                <th>2일전</th>
                <th>1일전</th>
                <th>강의 시작일</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{`100%환불`}</td>
                <td>{`80%환불`}</td>
                <td>{`80%환불`}</td>
                <td>{`80%환불`}</td>
                <td>{`환불불가`}</td>
                <td>{`환불불가`}</td>
                <td>{`환불불가`}</td>
                <td>{`환불불가`}</td>
              </tr>
              <tr>
                <td colSpan={8}>
                  신청당일 전액환불 가능
                </td>
              </tr>
              </tbody>
            </Table>
          );
        case 'normal':
          return (
            <Table priceTable>
              <thead>
              <tr>
                <th>5일전</th>
                <th>4일전</th>
                <th>3일전</th>
                <th>2일전</th>
                <th>1일전</th>
                <th>강의 시작일</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{`100%환불`}</td>
                <td>{`80%환불`}</td>
                <td>{`80%환불`}</td>
                <td>{`50%환불`}</td>
                <td>{`50%환불`}</td>
                <td>{`환불불가`}</td>
              </tr>
              <tr>
                <td colSpan={6}>
                  신청당일 전액환불 가능
                </td>
              </tr>
              </tbody>
            </Table>
          );
        case 'flex':
          return (
            <Table priceTable>
              <thead>
              <tr>
                <th>1일전</th>
                <th>강의 시작일</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{`100%환불`}</td>
                <td>{`환불불가`}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  신청당일 전액환불 가능
                </td>
              </tr>
              </tbody>
            </Table>
          );
        default:
          return null;
      }
    }, [refund_policy]);

    return detail ? (
      <MeetupDetailUl>
        {is_online_meetup && (
          <li>
            <h2>수강 정보</h2>
            <p className="pre-wrap">{online_note}</p>
          </li>
        )}
        <li>
          <h2>강사정보</h2>
          <p className="pre-wrap">{teacher_info}</p>
        </li>
        <li>
          <h2>문의</h2>
          <p className="pre-wrap">{payment_info}</p>
        </li>
        {products.some(({price}) => price > 0) && (
          <li>
            <h2>결제/환불정보</h2>
            {is_online_meetup ? (
              <OnClassRefundWrapper>
                <p className="onclass-refund-date">
                  결제일로부터&nbsp;<span>{onclass_available_refund_days || 0}일 내</span>
                </p>
                <Table onclassPriceTable>
                  <thead>
                    <tr>
                      <th>수강하지 않은 경우</th>
                      <th>수강한 경우</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>전액 환불 가능</td>
                      <td>총 강의 금액 - 실제 재생한 강의 수에 해당하는 금액</td>
                    </tr>
                  </tbody>
                </Table>
                <p className="onclass-refund-explain">
                  - 실제 재생한 강의 수에 해당하는 금액 : 수강한 강의의 정가 금액 / 강의 구성 수×학습 강의<br />
                  *예) 수강기간이 7일인경우 4월1일 15:00 결제 시점으로부터 4월8일 23:59 종료<br />
                  *영상 녹화 및 배포 시 법적 처벌을 받을 수 있습니다.
                </p>
                <ul className="onclass-seminar-notice">
                  <li>
                    <span>1.</span>
                    강의 동영상은 PC, 휴대폰, 태블릿, MAC OS 등의 기기로 수강할 수 있습니다.<br/>
                    (단, 2대 이상의 기기에서 동시 수강이 불가능합니다.)
                  </li>
                  <li>
                    <span>2.</span>
                      기기등록은 최대 3대까지 가능합니다. 강의를 재생하면 해당 기기가 자동으로 등록됩니다.<br/>
                      (수강 기기 변경이 필요한 경우 고객센터로 문의하시면 6개월당 1회에 한하여 초기화가 가능합니다.<br/>
                      즉, 한 번 기기 초기화를 진행하면 이후 6개월 간 초기화가 불가능합니다. 수강하실 기기를 신중하게 선택해주세요.)
                  </li>
                </ul>
              </OnClassRefundWrapper>
            ) : (
              <>
                {!!refundPolicyText && (
                  <p>{refundPolicyText}</p>
                )}
                {refundPolicyTable}
              </>
            )}
          </li>
        )}
        {!!(address && isEmpty(coordinates)) && (
          <li>
            <h2>지도보기</h2>
            <StyledMapShower
              address={address}
              onChangePosition={() => {}}
            />
          </li>
        )}
      </MeetupDetailUl>
    ) : null
  },
);

export default MeetupDetailInfo;

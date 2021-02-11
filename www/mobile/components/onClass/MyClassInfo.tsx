import * as React from 'react';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {$BORDER_COLOR, $POINT_BLUE, $GRAY, $WHITE, $TEXT_GRAY} from '../../styles/variables.types';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {Gauge} from '@hanii/planet-rating';
import cn from 'classnames';
import { ADMIN_PERMISSION_GRADE } from '../../src/constants/band';

const GAUGE_HEIGHT = 10;

const AdminStateUl = styled.ul`
  .off {
    color: #999;
  }

  .end {
    margin-left: 5px;
    color: #f32b43;
  }

  li {
    position: relative;
    ${heightMixin(50)};
    border-bottom: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 12,
      weight: '600',
    })};

    h3 {
      position: absolute;
      top: 15px;
      left: 0;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
      })};
    }

    p {
      padding-left: 89px;
      ${fontStyleMixin({
        size: 15,
        weight: '600',
        family: 'Montserrat',
        color: '#999',
      })};

      img {
        width: 10px;
        margin-right: 7px;
      }

      span {
        margin-left: 5px;
        color: #f32b43;
      }

      b {
        ${fontStyleMixin({
          size: 15,
          weight: '600',
          family: 'Montserrat',
          color: $POINT_BLUE,
        })};
      }
    }
  }

  @media screen and (max-width: 680px) {
    li {
      padding: 0 15px;

      h3 {
        left: 15px;
      }
    }
  }
`;

const CourseStateUl = styled.ul`
  .off {
    color: #999;
  }

  .end {
    margin-left: 12px;
    color: ${$TEXT_GRAY};
  }
  
  > li {
    position: relative;
    padding: 16px 0 15px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 12,
      weight: '600',
    })};

    h3 {
      position: absolute;
      top: 16px;
      left: 0;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
      })};
    }

    .gauge {
      display: inline-block;
      width: calc(100% - 111px);
      height: ${GAUGE_HEIGHT}px;
      margin-left: 71px;

      &::before {
        background-color: ${$BORDER_COLOR};
      }

      &.off::after {
        background-color: ${$GRAY};
      }
    }

    .gauge-percent {
      margin-left: 10px;
      ${fontStyleMixin({
        size: 15,
        family: 'Montserrat'
      })};
    }

    > p {
      padding-left: 71px;
      margin-top: -3px;
      ${fontStyleMixin({
        size: 15,
        weight: '600',
        family: 'Montserrat',
        color: '#999',
      })};

      img {
        width: 10px;
        margin-right: 5px;
      }

      span {
        color: #999;
      }

      b {
        ${fontStyleMixin({
          size: 15,
          weight: '600',
          family: 'Montserrat',
          color: $POINT_BLUE,
        })};
      }
    }

    ul {
      padding-left: 71px;

      li {
        ~ li {
          margin-top: 4px;
        }

        &:last-child {
          p {
            color: #999;
          }

          .onclass-during {
            background-color: ${$GRAY};
          }

          b {
            color: ${$POINT_BLUE};
          }
        }

        p {
          ${fontStyleMixin({
            size: 14,
            weight: '600',
            family: 'Montserrat',
            color: $TEXT_GRAY,
          })};

          .onclass-during {
            display: inline-block;
            width: 24px;
            height: 18px;
            line-height: 18px;
            margin-right: 9px;
            ${fontStyleMixin({
              size: 12,
              weight: '600',
              color: $WHITE
            })};
            text-align: center;
            background-color: ${$BORDER_COLOR};
          }

          b {
            ${fontStyleMixin({
              size: 14,
              weight: '600',
              family: 'Montserrat',
              color: $TEXT_GRAY,
            })};

            &.off {
              color: ${$TEXT_GRAY};
            }
          }

          .end {
            vertical-align: top;
            ${fontStyleMixin({
              size: 12,
              weight: '600',
              color: $TEXT_GRAY
            })};
          }

          .ing {
            margin-left: 12px;
            vertical-align: top;
            ${fontStyleMixin({
              size: 12,
              weight: '600',
            })};
          }
        }

        &.all-off {
          p {
            color: ${$TEXT_GRAY};

            .onclass-during {
              background-color: ${$BORDER_COLOR};
            }

            b {
              &.off {
                color: ${$TEXT_GRAY};
              }
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 680px) {
    > li {
      padding: 16px 15px 15px;

      h3 {
        left: 15px;
      }
    }
  }
`;

interface Props {
  band_member_grade: string;
  periods: {
    end_at: string;
    learning_status: string;
    start_at: string;
  }[];
  remainingDay: number;
  total_progress_rate: number;
  receipt_range: string[];
}

const MyClassInfo: React.FC<Props> = ({
  band_member_grade,
  periods = [],
  remainingDay,
  total_progress_rate,
  receipt_range
}) => {
  const isBeforeReceiptDate = receipt_range && moment(receipt_range[1]).isBefore();
  const isTotalEndPeriodRange = !isEmpty(periods) && moment(periods[periods.length - 1].end_at).isBefore();// 마지막 수강기간 종료됐는지

  const isVisitor = band_member_grade === 'visitor';

  return (
    ADMIN_PERMISSION_GRADE.includes(band_member_grade)
    ? (
      <AdminStateUl>
        <li>
          <h3>강의 신청기간</h3>
          {!isEmpty(receipt_range) && (
            <p>
              <img
                src={staticUrl('/static/images/icon/calender-date.png')}
                alt="강의 신청기간"
              />
              {receipt_range[0] && moment(receipt_range[0]).format('YYYY-MM-DD')}
              &nbsp;~&nbsp;
              <b>{moment(receipt_range[1]).format('YYYY-MM-DD')}</b>
              {isBeforeReceiptDate && <span className="end">종료</span>}
            </p>
          )}
        </li>
      </AdminStateUl>
    ) : !isVisitor && (
      <CourseStateUl>
        <li>
          <h3>나의 진도율</h3>
          <Gauge
            className={cn({off: isTotalEndPeriodRange})}
            height={GAUGE_HEIGHT}
            max={100}
            curr={total_progress_rate}
            width={100}
          />
          <span className="gauge-percent">{total_progress_rate}%</span>
        </li>
        {!isEmpty(periods) && (
          <li>
            <h3>학습기간</h3>
            {periods.length === 1 ? ( // length가 1일 때(학습기간이 1개일 때)
              <p>
                <img
                  src={staticUrl('/static/images/icon/calender-date.png')}
                  alt="학습기간"
                />
                {moment(periods[0].start_at).format('YYYY-MM-DD')}
                &nbsp;~&nbsp;
                <b className={cn({'off': isTotalEndPeriodRange})}>
                  {moment(periods[0].end_at).format('YYYY-MM-DD')}
                </b>
                {isTotalEndPeriodRange && <span className="end">종료</span>}
              </p>
            ) : ( // length가 1보다 클 때(학습기간이 2개 이상일 때)
              <ul>
                {periods.map(({
                  end_at,
                  start_at,
                }, index) => {
                  const isBeforePeriodRange = moment(end_at).isBefore();

                  return (
                    <li className={cn({'all-off': isTotalEndPeriodRange})}>
                      <p>
                        <span className="onclass-during">
                          {index + 1}차
                        </span>
                        {moment(start_at).format('YYYY-MM-DD')}
                        &nbsp;~&nbsp;
                        <b className={cn({'off': isBeforePeriodRange})}>
                          {moment(end_at).format('YYYY-MM-DD')}
                        </b>
                        {isBeforePeriodRange
                          ? <span className="end">종료</span>
                          : <span className="ing">수강중</span>}
                      </p>
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )}
        <li>
          <h3>남은 학습일</h3>
          <p>
            <img
              src={staticUrl('/static/images/icon/remaining-time.png')}
              alt="남은 학습일"
            />
            <b className={cn({'off': !remainingDay})}>
              {remainingDay}
            </b>
            <span>일</span>
          </p>
        </li>
      </CourseStateUl>
    )
  )
};

export default React.memo(MyClassInfo);
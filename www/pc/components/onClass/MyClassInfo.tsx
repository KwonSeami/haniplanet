import * as React from 'react';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {$BORDER_COLOR, $POINT_BLUE, $GRAY, $WHITE, $TEXT_GRAY} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {Gauge} from '@hanii/planet-rating';
import cn from 'classnames';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';
import Button from '../inputs/Button';
import {useDispatch, useSelector} from 'react-redux';
import {pushPopup} from '../../src/reducers/popup';
import OnClassExtensionPopup from '../layout/popup/OnClassExtensionPopup';
import {pickBandSelector} from '../../src/reducers/orm/band/selector';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {useRouter} from 'next/router';
import {LEARNING_STATUS} from '../../src/constants/meetup';
import isPlainObject from 'lodash/isPlainObject';

const AdminStateUl = styled.ul`
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  li {
    padding: 20px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 12,
      weight: '600',
    })};

    &:last-child {
      border-bottom: 0;
    }

    h3 {
      ${fontStyleMixin({
        size: 12,
        weight: '600',
      })};
    }

    p {
      margin-top: 7px;
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

        &.off {
          color: #999;
        }
      }
    }
  }
`;

const CourseStateUl = styled.ul`
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  > li {
    position: relative;
    min-height: 82px;
    padding: 20px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 12,
      weight: '600',
    })};

    &:last-child {
      border-bottom: 0;
    }

    h3 {
      margin-bottom: 7px;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
      })};
    }

    .gauge {
      top: 3px;

      &::before {
        background-color: ${$BORDER_COLOR};
      }

      &.off::after {
        background-color: ${$GRAY};
      }
    }

    .gauge-percent {
      position: absolute;
      right: 13px;
      transform: translateY(-3px);
      ${fontStyleMixin({
        size: 15,
        family: 'Montserrat',
      })};
    }
    
    p {
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
        color: #999;

        &.end {
          margin-left: 5px;
          color: ${$TEXT_GRAY};
        }
      }

      b {
        ${fontStyleMixin({
          size: 15,
          weight: '600',
          family: 'Montserrat',
          color: $POINT_BLUE,
        })};
        
        &.off {
          color: #999;
        }
      }
    }

    ul {
      padding-top: 3px;

      li {
        ~ li {
          margin-top: 4px;
        }

        &:not(:last-child) {
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

        p {
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
            background-color: ${$GRAY};
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
            margin-left: 5px;
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

    .button {
      position: absolute;
      top: 22px;
      right: 12px;
      padding: 0 12px;

      img {
        width: 13px;
        margin: -3px 0 0 2px;
        vertical-align: middle;
      }
    }
  }
`;

interface Props {
  learning_status: string;
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
  learning_status,
  band_member_grade,
  periods = [],
  remainingDay,
  total_progress_rate,
  receipt_range
}) => {
  const dispatch = useDispatch();
  const {query: {slug}} = useRouter();

  const isBeforeReceiptDate = receipt_range && moment(receipt_range[1]).isBefore();
  const isTotalEndPeriodRange = !isEmpty(periods) && moment(periods[periods.length - 1].end_at).isBefore();// 마지막 수강기간 종료됐는지
  const {onclass, me} = useSelector(({orm, system: {session: {id}}}) => ({
    onclass: pickBandSelector(slug)(orm) || {},
    me: pickUserSelector(id)(orm),
  }));

  const statusKor = LEARNING_STATUS[learning_status.split('_')[0]] || '';
  const {user_type, additional_data} = me || {};
  const {extension} = onclass;
  const {products = [], story = {}} = extension || {};
  const {meetup_status} = story || {};
  const userKeyList = isPlainObject(additional_data) ? additional_data : {};

  const filterProducts = React.useMemo(() => {
    if (!user_type) {
      return [];
    }
    const filteredProductsByUserType = (products || []).filter(({user_types}) => user_types.includes(user_type));
    const filteredProductsByUserKey = !isEmpty(userKeyList) &&
      filteredProductsByUserType.filter(({key = '', value}) => userKeyList[key] === value
      );
    const filteredList = isEmpty(filteredProductsByUserKey)
      ? learning_status === 'normal_avail'
        ? filteredProductsByUserType.filter(({key}) => !key)
        : filteredProductsByUserType.filter(({key, value}) => (key === learning_status.split('_')[0]) && (value === 'True'))
      : filteredProductsByUserKey;

    return filteredList;
  }, [products, user_type]);

  const isShowExtendBtn = meetup_status !== 'end'
    && learning_status !== 'normal_avail'
    && learning_status.includes('_')
    && !isEmpty(filterProducts)
  ;

  return (
    ADMIN_PERMISSION_GRADE.includes(band_member_grade)
    ? <AdminStateUl>
        <li>
          <h3>강의 신청기간</h3>
          {!isEmpty(receipt_range) && (
            <p>
              <img
                src={staticUrl('/static/images/icon/calender-date.png')}
                alt="강의 신청기간"
              />
              {moment(receipt_range[0]).format('YYYY-MM-DD')}
              &nbsp;~&nbsp;
              <b className={cn({'off': isBeforeReceiptDate})}>
                {moment(receipt_range[1]).format('YYYY-MM-DD')}
              </b>
              {isBeforeReceiptDate && <span>종료</span>}
            </p>
          )}
        </li>
      </AdminStateUl>
    : <CourseStateUl>
        <li>
          <h3>나의 진도율</h3>
          <Gauge
            className={cn({off: isTotalEndPeriodRange})}
            height={10}
            max={100}
            curr={total_progress_rate}
            width={87}
          />
          <span className="gauge-percent">{total_progress_rate}%</span>
        </li>
        <li>
          <h3>학습기간</h3>
          {!isEmpty(periods) && (
            periods.length === 1 ? ( // length가 1일 때(학습기간이 1개일 때)
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
                {/*
                  @경희님(학습기간쪽 스타일이 깨졌을 때 보시면 됩니다!!)
                  스타일 안내입니다 조금 복잡하네요ㅠㅠ
                  최대한 기존 className과 조건들을 활용했습니다.
                  그래서 기능 넣으시면 스타일은 알아서 잘 들어갈거예요 아마도 ㅎㅎ...
                  스타일이 깨졌을 때 이 주석을 읽어보시면 됩니다!
                  미리 안 보셔도 돼요! 그냥 혹시나해서 남긴거라!
                  잘 이해 안 되는 부분은 바로 말씀해주세요!

                  1. 수강 기간이 종료되기 전에 연장을 한 경우
                  b에 className="off"가 들어가지 않으면 깨지지 않습니다.(안 들어가겠죠?!)
                  <span className="end"/>가 보여야 합니다.
                  종료된 n차 기간 옆에 <span className="end"/>가 보여야 합니다.
                  아직 기간이 남은 n차 기간 옆에 <span className="ing"/>가 보여야 합니다.
                  아직 시작하지 않은 n차 기간 옆에 <span className="ing"/>가 보여야 합니다.

                  2. 수강 기간이 종료된 후 재수강을 한 경우
                  b에 className="off"가 들어가야합니다.(들어가겠죠?!)
                  종료된 n차 기간 옆에 <span className="end"/>가 보여야 합니다.
                  수강 중인 n차 기간 옆에 <span className="ing"/>가 보여야 합니다.
                */}
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
            )
          )}
        </li>
        <li>
          <h3>남은 학습일</h3>
          <p>
            <img
              src={staticUrl('/static/images/icon/remaining-time.png')}
              alt="남은 학습일"
            />
            <b className={cn({'off': !remainingDay})}>
              {remainingDay || 0}
            </b>
            <span>일</span>
          </p>
          {isShowExtendBtn && ( // 수강연장or재수강 가능 상태일 때 뜨는 버튼
            <Button
              size={{
                width: 'auto',
                height: '36px'
              }}
              border={{
                radius: '3px',
              }}
              font={{
                size: '14px',
                color: $WHITE
              }}
              backgroundColor="#499aff"
              onClick={() => (
                dispatch(pushPopup(OnClassExtensionPopup, {
                  status: statusKor,
                  productList: filterProducts
                }))
              )}
            >
              {statusKor}
              <img
                src={staticUrl('/static/images/icon/arrow/icon-white-arrow.png')}
                alt={statusKor}
              />
            </Button>
          )}
        </li>
      </CourseStateUl>
    )
};

export default React.memo(MyClassInfo);
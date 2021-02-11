import {staticUrl} from '../../../../src/constants/env';
import * as React from 'react';
import {MeetupListUl, Table} from './common';
import {numberWithCommas} from '../../../../src/lib/numbers';
import {dateRange, toHHMMSS} from '../../../../src/lib/date';
import {USER_TYPE_TO_KOR} from '../../../../src/constants/users';
import {APPLIED_STATUS_LIST} from '../../../../src/constants/meetup';
import moment from 'moment';

const TIME_KOR = ['시간 ', '분 ', '초'];
const NOT_SHOW_CONTENTS_LENGTH = [
  '마이루인(정다운)원장의 인강 4종',
  '철인28호장학기금-의학생리학강의',
];


const MeetupBasicInfo = React.memo(
  (
    {
      title,
      detail,
      participate_count,
      capacity,
      address,
      detail_address,
      total_contents_length,
      products = [],
      receipt_range: [receipt_start_at, receipt_end_at] = [],
      progress_range: [progress_start_at, progress_end_at] = [],
      user_types = [],
      region,
      status,
      is_online_meetup,
      course_period,
    },
  ) => {
    const isShowTotalLength = is_online_meetup && !!total_contents_length && !NOT_SHOW_CONTENTS_LENGTH.includes(title);

    return (
      detail ? (
        <Table>
          {address && (
            <tr>
              <th>장소</th>
              <td>{address} {detail_address}</td>
            </tr>
          )}
          <tr>
            <th>{is_online_meetup ? '수강기간' : '모임일시'}</th>
            <td>
              {is_online_meetup
                ? course_period ? `${course_period}일` : '없음'
                : `${dateRange(progress_start_at, progress_end_at, 'YYYY.MM.DD HH:mm')}`
              }
            </td>
          </tr>
          {isShowTotalLength && (
            <tr>
              <th>강의시간</th>
              <td>
                {toHHMMSS(total_contents_length, TIME_KOR)}
              </td>
            </tr>
          )}
          <tr>
            <th>{is_online_meetup ? '수강대상' : '신청대상'}</th>
            <td>{user_types.map(userType => USER_TYPE_TO_KOR[userType]) + ''}</td>
          </tr>
          <tr>
            <th>수강료</th>
            <td className="price-wrapper clearfix">
              <ul>
                {(products || []).map(({name, text, price, sale_price, sale_start_at, sale_end_at}) => {
                  const isInSale = !!sale_start_at && moment().isBetween(sale_start_at, sale_end_at, null, '[]');
                  const salePercent = sale_price && ((price - sale_price) / price) * 100;
                  return(
                    <li key={`story-product-${name}-${text}-${price}`}>
                      {name}
                      <div className="meetup-price">
                        <p>
                          {price > 0
                            ? (isInSale
                              ? ( //할인 기간인 경
                                <>
                                  <span className="discount-rate">{salePercent.toFixed(0)}%</span>
                                  <b>{numberWithCommas(sale_price)}</b>원
                                  <span className="fixed-price">
                                    <b>{numberWithCommas(price)}</b>원
                                  </span>
                                </>
                              ) : <><b>{numberWithCommas(price)}</b>원</>
                            ) : <span className="price-free">무료</span>
                          }
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </td>
          </tr>
          {!is_online_meetup && (
            <tr>
              <th>모임정원</th>
              <td>
                <span>
                  {participate_count}/{numberWithCommas(capacity)}
                </span>
              </td>
            </tr>
          )}
          <tr>
            <th>{is_online_meetup ? '접수기간' : '신청기간'}</th>
            <td>
              {dateRange(receipt_start_at, receipt_end_at, 'YYYY.MM.DD')}
            </td>
          </tr>
        </Table>
        ) : (
        <MeetupListUl>
          <li className="ellipsis place">
            <h3>
              <img
                src={staticUrl('/static/images/icon/icon-profile-map.png')}
                alt="장소"
              />
              장소
            </h3>
            {is_online_meetup ? '온라인 강의' : (region || {}).name}
          </li>
          <li className="date">
            <h3>
              <img
                src={staticUrl('/static/images/icon/icon-profile-date.png')}
                alt="모임일시"
              />
              {is_online_meetup ? '접수기간' : '모임일시'}
            </h3>
            <p className="ellipsis">
              {is_online_meetup
                ? `${dateRange(receipt_start_at, receipt_end_at, 'YYYY.MM.DD')}`
                : `${dateRange(progress_start_at, progress_end_at, 'YYYY.MM.DD')}`
              }
            </p>
          </li>
          {is_online_meetup && (
            <li className="range">
              <h3>
                <img
                  src={staticUrl('/static/images/icon/icon-profile-time.png')}
                  alt="수강기간"
                />
                수강기간
              </h3>
              <p>
                {course_period ? `${course_period}일` : '없음'}
              </p>
            </li>
          )}
          <li>
            <h3>
              <img
                src={staticUrl('/static/images/icon/icon-profile-gender.png')}
                alt="모임정원"
              />
              모임정원
            </h3>
            <p>
              {participate_count}/{numberWithCommas(capacity)}
              <span style={{backgroundColor: APPLIED_STATUS_LIST[status].color}}>{APPLIED_STATUS_LIST[status].status}</span>
            </p>
          </li>
        </MeetupListUl>
      )
    )
  }
);

export default MeetupBasicInfo;

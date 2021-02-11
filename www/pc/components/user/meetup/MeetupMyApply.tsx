import * as React from 'react';
import Link from 'next/link';
import moment from 'moment';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import UserFollowInfo from './style/UserFollowInfo';
import MeetupMyActivityItem from './style/MeetupMyActivityItem';
import FollowApi from '../../../src/apis/FollowApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../src/constants/env';
import {followUser} from '../../../src/reducers/orm/user/follow/thunks';
import { delStory } from '../../../src/reducers/orm/story/storyReducer';
import {LEARNING_STATUS, PAYMENT_STATUS} from '../../../src/constants/meetup';
import {IOnClassPeriod} from '../../../src/@types/IMeetUp';
import isEmpty from 'lodash/isEmpty';
import { fetchUserThunk } from '../../../src/reducers/orm/user/thunks';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {RootState} from '../../../src/reducers';
import {dateRange} from '../../../src/lib/date';

interface Props {
  id: HashId;
  story: {
    id: HashId;
    title: string;
    user: {
      id: HashId;
      name: string;
      avatar: string;
      is_follow: boolean;
    };
    is_online_meetup: boolean;
    region: {
      id: number;
      name: string;
    };
    receipt_range: string[];
    progress_range: string[];
  };
  created_at: string;
  price: number;
  merchant_uid: string;
  current_price: number;
  status: string;
  product_status: string;
  onclass_info?: {
    period_range: string[];
    periods: IOnClassPeriod[];
    remaining_days: number;
    slug: string;
  };
}

const MeetupMyApply = React.memo<Props>(({
  id,
  story: {
    id: storyId,
    title = '',
    user = {},
    is_online_meetup,
    region,
    receipt_range = [],
    progress_range = [],
  },
  created_at = '',
  merchant_uid = '',
  status = '',
  product_status = '',
  onclass_info = {},
}) => {
  const {id: writerId, name: writerName} = user || {} as any;
  const {name: regionName} = region || {} as any;
  const {periods = [], remaining_days = 0, slug} = onclass_info || {};
  const firstPeriod = (periods || [])[0] || {start_at: '', end_at: ''};
  const lastPeriod = (periods || [])[periods.length - 1] || {start_at: '', end_at: ''};

  React.useEffect(() => {
    // 유저 리듀서의 정보를 가져옵니다.
    dispatch(fetchUserThunk(writerId));
  }, [writerId]);

  const {
    writer: {is_follow},
  } = useSelector(
    ({orm, system: {session: {id}}}: RootState) => ({
      writer: pickUserSelector(writerId)(orm) || {},
    }),
    shallowEqual,
  );
  // Redux
  const dispatch = useDispatch();

  // API
  const followApi: FollowApi = useCallAccessFunc(access => new FollowApi(access));

  const startTime = new Date(is_online_meetup ? firstPeriod.start_at : progress_range[0]);
  const endTime = new Date(is_online_meetup ? lastPeriod.end_at : progress_range[1]);
  const isMeetupEnd = isEmpty(periods) || (is_online_meetup && moment().isAfter(endTime));
  const isExtendStatus = is_online_meetup && product_status !== null;

  const followBtnProps = {
    className: is_follow ? 'follow-cancel' : 'follow-add',
    btnImg: is_follow ? 'check/icon-story-follow-cancel.png' : 'icon-story-follow-add.png',
    text: is_follow ? '팔로우 취소' : '팔로우',
  };

  return (
    <MeetupMyActivityItem
      className="applied-li"
    >
      <ul>
        <li className="info-box">
          {
            <ul className="user-wrapper">
              <li>개설자</li>
              <li>{writerName}</li>
              <UserFollowInfo>
                <div
                  className={followBtnProps.className}
                  onClick={() => dispatch(followUser(writerId))}
                >
                  <img
                    src={staticUrl(`/static/images/icon/${followBtnProps.btnImg}`)}
                    alt="팔로우"
                  />
                  {followBtnProps.text}
                </div>
              </UserFollowInfo>
            </ul>
          }
          <div className="title">
            <Link
              href="/story/[id]"
              as={`/story/${storyId}`}
            >
              <a>
                <h3>
                  {title}
                  <img
                    src={staticUrl('/static/images/icon/arrow/icon-meetup-more.png')}
                    alt="more"
                  />
                </h3>
              </a>
            </Link>
          </div>
          <ul className="info">
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-meetup-place.png')}
                alt="장소"
              />
              <p>{is_online_meetup ? '온라인' : regionName}</p>
            </li>
            <li>
              <img
                src={staticUrl('/static/images/icon/calender-date.png')}
                alt="날짜"
              />
              <p>
                {isMeetupEnd
                  ? '수강종료'
                  : dateRange(startTime, endTime, 'YYYY.MM.DD')
                }
              </p>
            </li>
            {isExtendStatus  && ( //재수강or수강연장일 때 뜨는 문구
              <li className="onclass-extension">
                <img
                  src={staticUrl('/static/images/icon/check/check-blue.png')}
                  alt={LEARNING_STATUS[product_status]}
                />
                <p>{LEARNING_STATUS[product_status]}</p>
              </li>
            )}
            {!is_online_meetup && (
              <li>
                <img
                  src={staticUrl('/static/images/icon/icon-meetup-time.png')}
                  alt="시간"
                />
                <p>
                  {dateRange(startTime, endTime, 'HH:mm')}
                </p>
              </li>
            )}
          </ul>
        </li>
        <li className="created-date">
          <p>{moment(new Date(created_at)).format('YYYY.MM.DD')}</p>
        </li>
        <li className="created-state">
          <span>
            {PAYMENT_STATUS[status]}
          </span>
          <Link
            href="/payment/[merchant_uid]"
            as={`/payment/${merchant_uid}`}
          >
            <a>
              <p>
                결제내역보기
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-meetup-more.png')}
                  alt="more"
                />
              </p>
            </a>
          </Link>
        </li>
      </ul>
      <div
        className="followed-delete"
        onClick={() => {
          followApi.story(storyId)
            .then(() => dispatch(delStory(storyId)));
        }}
      >
        <img
          src={staticUrl('/static/images/icon/icon-followed-delete.png')}
          alt="삭제"
        />
      </div>
    </MeetupMyActivityItem>
  )
});

MeetupMyApply.displayName = 'MeetupMyApply';
export default MeetupMyApply;
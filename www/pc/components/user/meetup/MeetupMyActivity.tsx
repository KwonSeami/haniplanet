import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import UserFollowInfo from './style/UserFollowInfo';
import MeetupMyActivityItem from './style/MeetupMyActivityItem';
import FollowApi from '../../../src/apis/FollowApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../src/constants/env';
import {followUser} from '../../../src/reducers/orm/user/follow/thunks';
import {RootState} from "../../../src/reducers";
import {pickUserSelector} from "../../../src/reducers/orm/user/selector";
import { delStory } from '../../../src/reducers/orm/story/storyReducer';
import {pushPopup} from "../../../src/reducers/popup";
import MeetupApplyPopup from "../../story/MeetupApplyPopup";
import {APPLIED_STATUS_LIST, PAYMENT_STATUS} from '../../../src/constants/meetup';
import {IOnClassPeriod} from '../../../src/@types/IMeetUp';
import {dateRange} from '../../../src/lib/date';

interface Props {
  id: HashId;
  title: string;
  created_at: string;
  user: {
    id: HashId;
    name: string;
    is_follow: boolean;
  };
  extension: {
    status: string;
    capacity: number;
    participate_count: number;
    receipt_range: Date;
    progress_range: Date;
    region: {
      name: string;
    };
    products: any[];
    is_online_meetup: boolean;
    onclass_build_status: string;
  };
  is_apply: boolean;
  onclass_info?: {
    period_range: string[];
    periods: IOnClassPeriod[];
    remaining_days: number;
    slug: string;
  };
}

const CLASS_WAITING_STATUS = {
  ongoing: {
    label: 'STEP.1',
    explain: '온라인 세미나/모임 개설 완료'
  },
  approved: {
    label: 'STEP.2',
    explain: '한의플래닛에서 개별 안내'
  },
  monitoring: {
    label: 'STEP.3',
    explain: '컨텐츠 검수 진행'
  },
  monitored: {
    label: 'STEP.4',
    explain: 'MOA 개설 및 컨텐츠 업로드'
  },
  done: {
    label: 'STEP.5',
    explain: '온라인 세미나/모임 접수 시작'
  },
};

const MeetupMyActivity = React.memo<Props>(({
  id,
  title,
  created_at,
  user,
  extension: {
    status,
    capacity,
    participate_count,
    receipt_range,
    progress_range,
    region,
    products,
    is_online_meetup,
    onclass_build_status,
  },
  is_apply,
  onclass_info
}) => {
  const {id: writerId} = user || {} as any;
  const {name: regionName} = region || {} as any;
  const {periods = [], remaining_days = 0, slug} = onclass_info || {};
  const firstPeriod = (periods || [])[0] || {start_at: '', end_at: ''};
  const lastPeriod = (periods || [])[periods.length - 1] || {start_at: '', end_at: ''};

  const router = useRouter();
  const {query: {page_type}} = router;

  // Redux
  const dispatch = useDispatch();
  const {
    writer: {name, is_follow},
    me: {id: myId},
  } = useSelector(
    ({orm}: RootState) => ({
      writer: pickUserSelector(writerId)(orm) || {},
      me: pickUserSelector(id)(orm) || {},
    }),
    shallowEqual,
  );

  // API
  const followApi: FollowApi = useCallAccessFunc(access => new FollowApi(access));

  const startTime = page_type === 'onclass'
    ? new Date(is_online_meetup ? firstPeriod.start_at : progress_range[0])
    : new Date(is_online_meetup ? receipt_range[0] : progress_range[0]);
  const endTime = page_type === 'onclass'
    ? new Date(is_online_meetup ? lastPeriod.end_at : progress_range[1])
    : new Date(is_online_meetup ? receipt_range[1] : progress_range[1]);
  const isOnclassDone = onclass_build_status === 'done';
  const isMeetupEnd = (is_online_meetup && ((page_type === 'onclass' && isEmpty(periods)) || moment().isAfter(endTime)));

  const followBtnProps = {
    className: is_follow ? 'follow-cancel' : 'follow-add',
    btnImg: is_follow ? 'check/icon-story-follow-cancel.png' : 'icon-story-follow-add.png',
    text: is_follow ? '팔로우 취소' : '팔로우',
  };

  return (
    <MeetupMyActivityItem
      className={cn({
        'created-li': page_type === 'created',
        'followed-li': page_type === 'followed',
        'my-class-li': page_type === 'onclass',
      })}
    >
      <ul>
        <li className="info-box">
          {(page_type !== 'created') && (
            <ul className="user-wrapper">
              <li>개설자</li>
              <li>{name}</li>
              {myId !== writerId && (
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
              )}
            </ul>
          )}
          <div className="title">
            <Link
              href="/story/[id]"
              as={`/story/${id}`}
            >
              <a
                onClick={e => {
                  if (is_online_meetup && !isOnclassDone) {
                    e.preventDefault();
                    alert('조금만 더 기다려주세요! \n세미나/모임 개설을 위한 단계가 진행되고 있습니다.')
                  }
                }}
              >
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
            {(!is_online_meetup || isOnclassDone) ? (
              <>
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
                      ? (page_type === 'onclass') ? '수강종료' : '신청종료'
                      : dateRange(startTime, endTime, 'YYYY.MM.DD')
                    }
                  </p>
                </li>
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
              </>
            ) : (
              <li className="stand-by">
                <p>
                  {(CLASS_WAITING_STATUS[onclass_build_status] || {}).label}
                  <img
                    src={staticUrl('/static/images/icon/arrow/arrow-double-yellow.png')}
                    alt="화살표"
                  />
                  <span>
                    {(CLASS_WAITING_STATUS[onclass_build_status] || {}).explain}
                  </span>
                </p>
              </li>
            )}
            {page_type === 'created' && (
              <li className="applied-state">
                <img
                  src={staticUrl('/static/images/icon/icon-meetup-personnel.png')}
                  alt="more"
                />
                <p>
                  <span className={cn({off: !isOnclassDone})}>
                    {participate_count}
                  </span>
                  {!is_online_meetup && `/${capacity}`}
                </p>
                <span className={cn({on: status !== 'end'})}>
                  {APPLIED_STATUS_LIST[status].status}
                </span>
              </li>
            )}
          </ul>
        </li>
        {page_type === 'created' && (
          <li className="applied-list">
            <button
              // TODO: @샘이님 disabled 상태일 때 스타일 추가 부탁드립니다.
              disabled={is_online_meetup && !isOnclassDone}
              onClick={() => {
                if (!participate_count) {
                  alert('아직 신청자 목록이 없습니다.');
                } else {
                  dispatch(pushPopup(MeetupApplyPopup, {
                    storyPk: id,
                    is_online_meetup,
                  }));
                }
              }}
            >
              신청자 목록보기
            </button>
            {(is_online_meetup && isOnclassDone) && (
              // 나의 강의실 id 추가해야함
              <Link
                href="/onclass/[slug]"
                as={`/onclass/${slug}`}
              >
                <a>
                  <p>
                    강의실 가기
                    <img
                      src={staticUrl('/static/images/icon/arrow/icon-meetup-more.png')}
                      alt="강의실 가기"
                    />
                  </p>
                </a>
              </Link>
            )}
          </li>
        )}
        {page_type === 'followed' && (
          <li className="followed-state">
            <span className={cn({on: status !== 'end' || is_apply !== true})}>
              {APPLIED_STATUS_LIST[status].status}
            </span>
            <button
              disabled={status === 'end' || is_apply === true}
              onClick={() => {
                router.push(
                  {pathname: '/story/[id]', query: {option: 'payment'}},
                  {pathname: `/story/${id}`},
                );
              }}
            >
              <i />
              신청하기
            </button>
          </li>
        )}
        {/*@샘이님, 수강 종료일 때에도 스타일 변화가 없는지 확인 부탁드립니다.*/}
        {page_type === 'onclass' && (
          <>
            <li className="class-duration">
              <p className={cn({off: !remaining_days})}>
                {remaining_days > 0
                  ? <>{remaining_days}<span>일</span></>
                  : '수강 종료'}
              </p>
            </li>
            <li className="class-state">
              <Link
                href="/onclass/[slug]"
                as={`/onclass/${slug}`}
              >
                <a>
                  <p>
                    강의실 가기
                    <img
                      src={staticUrl('/static/images/icon/arrow/icon-meetup-more.png')}
                      alt="강의실 가기"
                    />
                  </p>
                </a>
              </Link>
            </li>
          </>
        )}
      </ul>
      <div
        className="followed-delete"
        onClick={() => {
          followApi.story(id)
            .then(() => dispatch(delStory(id)));
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

MeetupMyActivity.displayName = 'MeetupMyActivity';
export default MeetupMyActivity;
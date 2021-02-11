import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import moment from 'moment';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import isEmpty from 'lodash/isEmpty';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import Button from '../inputs/Button';
import FollowApi from '../../src/apis/FollowApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {RootState} from '../../src/reducers';
import {staticUrl} from '../../src/constants/env';
import {delStory} from '../../src/reducers/orm/story/storyReducer';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {$GRAY, $FONT_COLOR, $BORDER_COLOR, $TEXT_GRAY, $POINT_BLUE, $WHITE} from '../../styles/variables.types';
import {followUser} from '../../src/reducers/orm/user/follow/thunks';
import {APPLIED_STATUS_LIST} from '../../src/constants/meetup';
import { IOnClassPeriod } from '../../src/@types/IMeetUp';
import { dateRange } from '../../src/lib/date';

export const Li = styled.li`
  position: relative;
  margin-top: 8px;
  padding: 15px 0;
  background-color: ${$WHITE};
  overflow: hidden;
  
  .title {
    padding: 0 15px;

    h3 {
      line-height: 22px;
      ${fontStyleMixin({
        size: 15,
        weight: '600',
        color: $FONT_COLOR
      })};

      img {
        vertical-align: middle;
        width: 19px;
        height: 19px;
        margin-top: -3px;
      }
    }
  }

  .user-wrapper {
    padding: 8px 15px 0;

    li {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY
      })};

      &:first-child::after {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 6px;
        margin: 0 5px;
        border-left: 1px solid ${$BORDER_COLOR};
      }
    }
  }
   
  .content {
    > ul:not(.btn-wrapper) {
      padding: 0 15px;
      margin-top: 12px;
      
      > li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 50%; 
        box-sizing: border-box;

        & ~ li{
          padding: 0 15px;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0px;
            transform: translateY(-50%);
            width: 1px;
            height: 53px;
            border-left: 1px solid #eee;
          }
        }
      
        &.info {
          li {
            & ~ li p {
              font-family: 'Montserrat';
            }

            &.onclass-extension {
              margin-top: 2px;
              
              img {
                margin: -1px 2px 0 0;
              }
  
              p {
                ${fontStyleMixin({
                  size: 11,
                  weight: '600',
                  color: $POINT_BLUE
                })};
              }
            }

            img {
              display: inline-block;
              vertical-align: middle;
              width: 10px;
              height: 12px;
              margin-right: 5px;
            }

            p {
              display: inline-block;
              vertical-align: middle;
              ${fontStyleMixin({
                size: 11,
                color: $GRAY
              })};
            }
          }
        }

        &.my-class-info {
          width: auto;

          li {
            display: inline-block;
            margin-right: 12px;

            &:nth-child(2) p {
              font-family: Montserrat;
            }
          }

          img {
            display: inline-block;
            vertical-align: middle;
            width: 10px;
            height: 12px;
            margin-right: 5px;
          }

          p {
            display: inline-block;
            vertical-align: middle;
            ${fontStyleMixin({
              size: 11,
              color: $GRAY
            })};
          }

          span {
            ${fontStyleMixin({
              size: 11,
              weight: 'bold',
              color: $POINT_BLUE,
            })};
          }
        }
      }
    }

    .btn-wrapper {
      display: table;
      width: calc(100% + 6px);
      padding: 0 15px;
      margin-left: -3px;
      box-sizing: border-box;

      li {
        display: table-cell;
        width: 50%;
        padding: 0 3px;
      }
    }

    .created-state {
      padding-bottom: 3px;
      text-align: left;

      span {
        ${fontStyleMixin({
          size: 11,
          weight: 'bold',
          color: $POINT_BLUE
        })};

        &.refund {
          color: #f32b43;
        }
      }

      p {
        margin-top: 8px;
        font-size: 14px;
      }

      img {
        vertical-align: middle;
        width: 19px;
        height: 19px;
        margin-top: -2px;
      }
    }

    .state {
      img {
        vertical-align: middle;
        width: 22px;
        height: 20px;
        margin-right: 6px;
      }

      p {
        display: inline-block;
        vertical-align: middle;
        font-family: 'Montserrat';
        color: #999;

        span {
          ${fontStyleMixin({
            color: $POINT_BLUE,
            weight: '600',
            family: 'Montserrat',
          })};

          &.off {
            color: #999;
          }
        }
      }

      > span {
        display: inline-block;
        vertical-align: middle;
        margin-top: -1px;
        ${fontStyleMixin({
          size: 11,
          weight: 'bold',
          color: '#999',
        })};

        &::before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background-color: #999;
          margin: 0 8px;
        }

        &.on {
          color: ${$POINT_BLUE};
        }
      }
    }
  }

  .stand-by {
    padding-top: 15px;
    margin-top: 19px;
    border-top: 1px solid #eee;
    text-align: center;

    p {
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        family: 'Montserrat',
        color: '#ecbb51',
      })};

      img {
        width: 16px;
        vertical-align: middle;
        margin: -2px 8px 0 3px;
      }

      span {
        ${fontStyleMixin({
          size: 13,
          weight: '600',
          color: $GRAY,
        })};
      }
    }
  }

  .button-box {
    padding: 0 15px;

    .button {
      width: calc(100% - 43px);
      vertical-align: middle;
    }

    .followed-delete {
      width: 35px;
      margin-right: 8px;
      background-color: #f9f9f9;

      img {
        width: 18px;
        height: 18px;
        margin-top: 5px;
      }
    }
  }

  .class-state {
    padding-top: 15px;
    margin-top: 19px;
    border-top: 1px solid #eee;
    text-align: center;

    p {
      ${fontStyleMixin({
        size: 14,
      })};

      img {
        width: 19px;
        vertical-align: middle;
        margin-top: -2px;
      }
    }
  }
`;

export const UserFollowInfo = styled.li`
  margin: -1px 0 0 4px;

  div {
    ${fontStyleMixin({
      size: 13,
      weight: '600'
    })};

    &.follow-add {
      color: ${$POINT_BLUE};
    }

    &.follow-cancel {
      color: ${$GRAY};
    }

    img {
      vertical-align: middle;
      margin-top: -2px;
      width: 15px;
      height: 15px;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 35px;
  margin-top: 20px;
  border-radius: 0;
  border: 1px solid ${$BORDER_COLOR};
  ${fontStyleMixin({
    size: 13,
    weight: '600',
    color: '#000'
  })};

  i {
    display: inline-block;
    vertical-align: -4px;
    width: 17px;
    height: 17px;
    text-indent: -9999px;
    overflow: hidden;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/check/icon-check-basic.png'),
    })};
  }

  &[disabled] {
    color: ${$TEXT_GRAY};
    border-color: transparent;
    background-color: #f4f4f4;
    opacity: 1;

    i {
      opacity: 0.3;
    }
  }
`;

interface Props {
  id: HashId;
  title: string;
  created_at: string;
  apply_status: string;
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
  onclass_info?: {
    period_range: string[];
    periods: IOnClassPeriod[];
    remaining_days: number;
    slug: string;
  };
  is_apply: boolean;
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
  user,
  extension: {
    status,
    capacity,
    receipt_range,
    participate_count,
    progress_range,
    region,
    products,
    is_online_meetup,
    onclass_build_status,
  },
  is_apply,
  onclass_info,
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
    ({orm, system: {session: {id}}}: RootState) => ({
      writer: pickUserSelector(writerId)(orm) || {},
      me: pickUserSelector(id)(orm) || {},
    }),
    shallowEqual,
  );

  // API
  const followApi: FollowApi = useCallAccessFunc(access => new FollowApi(access));
  const startTime = page_type === 'onclass'
    ? new Date((is_online_meetup && !!firstPeriod) ? firstPeriod.start_at : progress_range[0])
    : new Date(is_online_meetup ? receipt_range[0] : progress_range[0]);
  const endTime = page_type === 'onclass'
    ? new Date((is_online_meetup && !!lastPeriod) ? lastPeriod.end_at : progress_range[1])
    : new Date(is_online_meetup ? receipt_range[1] : progress_range[1]);

  const isOnclassDone = onclass_build_status === 'done';
  const isMeetupEnd = (is_online_meetup && ((page_type === 'onclass' && isEmpty(periods)) || moment().isAfter(endTime)));
  const followBtnProps = {
    className: is_follow ? 'follow-cancel' : 'follow-add',
    btnImg: is_follow ? 'icon-story-follow-cancel.png' : 'icon-story-follow-add.png',
    text: is_follow ? '팔로우 취소' : '팔로우',
  };
  
  return (
    <Li>
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
      {page_type !== 'created' && (
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
      <div className="content">
        <ul>
          {(page_type !== 'onclass') && (
            <li className="info">
              <ul>
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
              </ul>
            </li>
          )}
          {page_type === 'onclass' && (
            <li className="my-class-info">
              <ul>
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
                    {dateRange(startTime, endTime, 'YYYY.MM.DD')}
                  </p>
                </li>
                <li>
                  <img
                    src={staticUrl('/static/images/icon/remaining-time.png')}
                    alt="남은 시간"
                  />
                  {/*@샘이님, 수강 종료일 때에도 스타일 변화가 없는지 확인 부탁드립니다.*/}
                  {remaining_days > 0
                    ? <p><span>{remaining_days}일</span>&nbsp;남음</p>
                    : '수강 종료'}
                </li>
              </ul>
            </li>
          )}
          {page_type === 'created' && (
            <li className="state">
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
          {page_type === 'followed' && (
            <li className="state">
              <img
                src={staticUrl('/static/images/icon/icon-meetup-personnel.png')}
                alt="more"
              />
              <p>
                <span>{participate_count}</span>
                /{capacity}
              </p>
              <span className={cn({on: status !== 'end'})}>
                {APPLIED_STATUS_LIST[status].status}
              </span>
            </li>
          )}
        </ul>
        {page_type === 'created' && (
          (!is_online_meetup || isOnclassDone) ? (
            <ul className="btn-wrapper">
              <li>
                <StyledButton
                  onClick={() => (
                    !participate_count ? (
                      alert('아직 신청자 목록이 없습니다.')
                    ) : (
                      router.push('/story/[id]/applicant', `/story/${id}/applicant`)
                    )
                  )}
                >
                  신청자 목록보기
                </StyledButton>
              </li>
              {is_online_meetup && (
                <li>
                  <Button
                    border={{width: '0', radius: '0'}}
                    size={{width: '100%', height: '35px'}}
                    font={{size: '13px', weight: '600', color: $WHITE}}
                    backgroundColor="#499aff"
                    // onclass id값 추가해야함
                    onClick={() => router.push('/onclass/[slug]', `/onclass/${slug}`)}
                  >
                    강의실 가기
                  </Button>
                </li>
              )}
            </ul>
          ) : (
            <div className="stand-by">
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
            </div>
          )
        )}
        {page_type === 'followed' && (
          <div className="button-box">
            <StyledButton
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
            </StyledButton>
            <StyledButton
              disabled={status === 'end' || is_apply === true}
              onClick={() => {
                router.push(
                  {pathname: '/story/[id]', query: {option: 'payment'}},
                  {pathname: `/story/${id}`},
                );
              }}
            >
              <i>신청하기</i>
              신청하기
            </StyledButton>
          </div>
        )}
        {page_type === 'onclass' && (
          <div className="class-state">
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
          </div>
        )}
      </div>
    </Li>
  )
});

MeetupMyActivity.displayName = 'MeetupMyActivity';
export default MeetupMyActivity;

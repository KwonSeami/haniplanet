import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {Waypoint} from 'react-waypoint';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../components/common/Loading';
import NoContentACLi from '../components/AutocompleteList/NoContentACLi';
import UserApi from '../src/apis/UserApi';
import {axiosInstance} from '@hanii/planet-apis';
import {BASE_URL} from '../src/constants/env';
import {timeSince} from '../src/lib/date';
import {fontStyleMixin} from '../styles/mixins.styles';
import {updateUser} from '../src/reducers/orm/user/userReducer';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $WHITE} from '../styles/variables.types';
import loginRequired from "../hocs/loginRequired";
import Avatar from '../components/Avatar';

const Section = styled.section`
  padding: 50px 0 100px;
  background-color: #f6f7f9;

  ul {
    max-width: 580px;
    min-height: 697px;
    margin: auto;
    box-sizing: border-box;
    background-color: ${$WHITE};

    &.no-alarm {
      min-height: 435px;
    }

    li {
      min-height: 79px;
      padding: 13px 16px 9px;
      box-sizing: border-box;
      border-bottom: 1px solid ${$BORDER_COLOR};

      a {
        > div {
          position: relative;
          display: table;
          box-sizing: border-box;
  
          &::before {
            content: '';
            width: 4px;
            height: 4px;
            background-color: ${$POINT_BLUE};
            position: absolute;
            left: -9px;
            top: 3px;
            border-radius: 50%;
          }
        }
      }

      .user-avatar {
        width: 48px;
        display: table-cell;
        vertical-align: top;

        .avatar {
          vertical-align: bottom;
        }
      }

      p {
        display: table-cell;
        vertical-align: top;
        font-size: 14px;
      }

      .read-icon {
        display: block;
        padding-top: 3px;
        ${fontStyleMixin({
          size: 12,
          color: `${$POINT_BLUE} !important`,
          weight: '600'
        })}
      }

      &.read-at {
        background-color: #f9f9f9;
        
        div, p, .read-icon {
          opacity: 0.4;
          color: ${$FONT_COLOR} !important;
        }

        a::before {
          display: none;
        }
      }
    }

    li.read-all {
      min-height: auto;
      height: 44px;
      width: 100%;
      border-bottom-width: 0;
      text-align: right;

      span {
        position: relative;
        text-decoration: underline;  
        ${fontStyleMixin({
          size: 13,
          weight: 'bold',
          color: `${$POINT_BLUE} !important`
        })}
      } 
    }
  }

  @media screen and (max-width: 500px) {
    padding: 0;
  }
`;

const StyledNoContentLi = styled(NoContentACLi)`
  padding-top: 116px !important;
  font-size: 15px;
`;

const MAX_PAYLOAD_TEXT_LENGTH = 30;

const ALARM_HREF = {
  point: {
    pathname: '/user/point',
    query: {tab: 'history'},
  },
  point_withdrawal: {
    pathname: '/user/point',
    query: {tab: 'history', list: 'point_withdrawal'},
  }
};

const reg = new RegExp(/\{\w+\}/g);

const Alarm = React.memo(() => {
  const [ids, setIds] = React.useState([]);
  const [pending, setPending] = React.useState(true);
  const [alarmMap, setAlarmMap] = React.useState({});
  const [rest, setRest] = React.useState({});

  // Redux
  const {access, myId} = useSelector(({system: {session: {access, id: myId}}}) => ({access, myId}));
  const dispatch = useDispatch();

  const fetchAlarm = (uri?: string) => {
    (uri
      ? axiosInstance({token: access, baseURL: BASE_URL}).get(uri)
      : new UserApi(access).alarm(myId)
    ).then(({data: {results, ...kwargs}}) => {
      if (!!results) {
        const _ids = [...ids];
        const _map = {...alarmMap};
        results.forEach(alarm => {
          if(!_ids.includes(alarm.id)){
            _ids.push(alarm.id);
          }
          _map[alarm.id] = alarm;
        });
        setIds(_ids);
        setAlarmMap(_map);
        setRest(kwargs);
      }
      setPending(false);
    }).catch(() => setPending(false));
  };

  // Life Cycle -> Fetch Data
  React.useEffect(() => {
    if (!!access && !!myId) {
      fetchAlarm();
    }
  }, [access, myId]);

  if (pending) {
    return <Loading />;
  }

  return (
    <Section>
      <ul className={cn({'no-alarm': isEmpty(ids)})}>
        {!isEmpty(ids) ? (
          <>
            <li className="read-all">
              <span
                onClick={() => {
                  new UserApi(access).readAllAlarm(myId)
                    .then(({status}) => {
                      if (Math.floor(status / 100) === 2) {
                        setAlarmMap(currAlarmMap => (
                          ids.reduce((prev,curr) => {
                            prev[curr] = {
                              ...currAlarmMap[curr],
                              read_at: !currAlarmMap[curr].read_at
                                ? new Date().toISOString()
                                : currAlarmMap[curr].read_at
                            };
                            return prev;
                          }, {}))
                        );
                        dispatch(updateUser(
                          myId,
                          ({alarm_count, ...curr}) => ({...curr, alarm_count: 0})
                        ));
                      }})
                }}
              >
                모두 읽기
              </span>
            </li>
            {ids.map(id => {
              const data = alarmMap[id];
              if (!data) {
                return null;
              }
              try {
                const {read_at, created_at, payload, message} = data;
                const patterns = message.match(reg);
                const segments = message.split(reg);
                const children = [];
                segments.forEach((seg, idx) => {
                  if (seg) {
                    children.push(<span key={seg}>{seg}</span>);
                  }
                  if (idx !== segments.length - 1) {
                    const pattern = patterns[idx];
                    const key = pattern.substring(1, pattern.length - 1);
                    const currPayload = payload[key];
                    !!currPayload && children.push(
                      <strong key={currPayload.text}>
                        {
                          currPayload.text.length <= MAX_PAYLOAD_TEXT_LENGTH
                          ? currPayload.text
                          : `${currPayload.text.substr(0, MAX_PAYLOAD_TEXT_LENGTH)}...`
                        }
                      </strong>,
                    );
                  }
                });

                const {user, primary: _primary} = payload;
                const {[_primary]: primary} = payload;
                const secondPrimary = primary.search &&
                  primary.search.match(/[a-zA-Z]/g).join('');
                const search = secondPrimary
                  ? primary.search.replace(`{${secondPrimary}}`,payload[secondPrimary]
                    ? (secondPrimary === 'comment' && payload[secondPrimary].parent_id)
                      ? `${secondPrimary}-${payload[secondPrimary].parent_id}-${payload[secondPrimary].id}`//대댓글인 경우 #comment-{ParentId}-{댓글Id}
                      : `${secondPrimary}-${payload[secondPrimary].id}`// 대댓글이 아닌 경우 #meetup-{meetup.id}, #comment-{comment.id}등의 형태로 replace됩니다
                    : secondPrimary // primary search값을 키값으로 가지는 객체가 없는 경우 secondPrimary값을 그대로 search로 이용합니다.(ex. 세미나)
                  ) : '';

                const href = ALARM_HREF[_primary] || `/${primary.model.toLowerCase()}/${primary.id}${search}`;

                return (
                  <li
                    key={id}
                    className={cn({'read-at': read_at})}
                  >
                    <Link href={href} as={href}>
                      <a
                        onClick={() => {
                          if(!read_at) {
                            setAlarmMap(curr => ({
                              ...curr,
                              [id]: {...curr[id], read_at: new Date().toISOString()},
                            }));
                            axiosInstance({token: access, baseURL: BASE_URL}).patch(`/alarm/${id}/`)
                              .then(({status}) => {
                                if (status === 200) {
                                  dispatch(updateUser(
                                    myId,
                                    ({alarm_count, ...curr}) => ({
                                      ...curr,
                                      alarm_count: alarm_count - 1
                                    }),
                                  ));
                                } else {
                                  // API 호출에 실패하면 알림을 읽지 않은 것으로 처리합니다.
                                  setAlarmMap(curr => ({
                                    ...curr,
                                    [id]: {...curr[id], read_at: null},
                                  }));
                                }
                              });
                          }
                        }}
                      >
                        <div>
                          {user && (
                            <div className="user-avatar">
                              <Avatar
                                id={user.id}
                                size={40}
                                src={user.avatar}
                                userExposeType="real"
                              />
                            </div>
                          )}
                          <p>
                            {children}
                            <span className={cn('read-icon', {ring: !read_at})}>{timeSince(created_at)}</span>
                          </p>
                        </div>
                      </a>
                    </Link>
                  </li>
                );
              } catch (err) {
                return null;
              }
            })}
          </>
          ) : (
            <StyledNoContentLi>
              새로운 알림이 없습니다.
            </StyledNoContentLi>
          )}
        {rest.next && (
          <Waypoint onEnter={() => fetchAlarm(rest.next)}>
            <Loading />
          </Waypoint>
        )}
      </ul>
    </Section>
  );
});

Alarm.displayName = 'Alarm';


export default loginRequired(Alarm);

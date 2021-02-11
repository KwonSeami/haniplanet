import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import {Waypoint} from 'react-waypoint';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {axiosInstance} from '@hanii/planet-apis';
import AlarmCountLabel from './style/AlarmCountLabel';
import AlarmNoContentLi from './style/AlarmNoContentLi';
import Loading from '../../../common/Loading';
import NoticeWrapperDiv from './style/NoticeWrapperDiv';
import NoticeUl from './style/NoticeUl';
import TransBg from '../../../TransBg';
import UserApi from '../../../../src/apis/UserApi';
import headerTheme from '../theme';
import {IconImg} from '../styleCompPC';
import {timeSince} from '../../../../src/lib/date';
import {updateUser} from '../../../../src/reducers/orm/user/userReducer';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {BASE_URL, staticUrl} from '../../../../src/constants/env';

interface Props {
  theme: keyof (typeof headerTheme['alarmIcon']);
}

const reg = new RegExp(/\{\w+\}/g);

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

const AlarmList = React.memo<Props>(({theme}) => {
  // State
  const [on, setOn] = React.useState(false);
  const [ids, setIds] = React.useState([]);
  const [alarmMap, setAlarmMap] = React.useState({});
  const [rest, setRest] = React.useState({});

  // Redux
  const dispatch = useDispatch();
  const {access, myId, user: {alarm_count}} = useSelector(
    ({system: {session: {access, id: myId}}, orm}) => ({
      access,
      myId,
      user: pickUserSelector(myId)(orm) || {} as any,
    }),
    shallowEqual,
  );

  const alarmIconKey = React.useMemo(() => on ? 'on' : theme, [on, theme]);
  const fetchAlarm = (uri?: string) => {
    (uri
      ? axiosInstance({token: access, baseURL: BASE_URL}).get(uri)
      : new UserApi(access).alarm(myId)
    ).then(({data: {results, ...kwargs}}) => {
      if (results) {
        const _ids = [...ids];
        const _map = {...alarmMap};

        results.forEach(alarm => {
          if (!_ids.includes(alarm.id)) {
            _ids.push(alarm.id);
          }
          _map[alarm.id] = alarm;
        });
        // if (alarm_count !== kwargs.count) {
        //   dispatch(updateUser(myId, ({alarm_count, ...curr}) => ({...curr, alarm_count: kwargs.count})));
        // }
        setIds(_ids);
        setAlarmMap(_map);
        setRest(kwargs);
      }
    });
  };

  React.useEffect(() => {
    if (!access) {
      // 만약 로그아웃이 된다면 알람 리스트를 비웁니다.
      setIds([]);
      setAlarmMap({});
      setRest({});
    }
  }, [access]);

  return (
    <>
      <div
        className="pointer"
        onClick={() => {
          if (!access) {
            alert('로그인 후 이용 가능합니다.');
            return null;
          }

          setOn(true);
          fetchAlarm();
        }}
      >
        <IconImg
          src={headerTheme.alarmIcon[alarmIconKey]}
          alt="알림"
        />
        {!!alarm_count && (
          <AlarmCountLabel>{alarm_count}</AlarmCountLabel>
        )}
      </div>
      {on && (
        <>
          <TransBg onClick={() => setOn(false)}/>
          <NoticeWrapperDiv>
            <NoticeUl>
              {!isEmpty(ids) ? (
                ids.map(id => {
                  const data = alarmMap[id];
                  if (!data) {
                    return <Loading/>;
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
                          ? `${payload[secondPrimary].parent_id}-${payload[secondPrimary].id}` //대댓글인 경우 #comment-{ParentId}-{댓글Id}
                          : `${payload[secondPrimary].id}` // 대댓글이 아닌 경우 #meetup-{meetup.id}, #comment-{comment.id}등의 형태로 replace됩니다
                        : secondPrimary // primary search값을 키값으로 가지는 객체가 없는 경우 secondPrimary값을 그대로 search로 이용합니다.(ex. 세미나)
                      ) : '';

                    const href = ALARM_HREF[_primary] || `/${primary.model.toLowerCase()}/${primary.id}${search}`;


                    return (
                      <li key={id}>
                        <Link href={href} as={href}>
                          <a
                            className={cn({'read-at': read_at})}
                            onClick={() => {
                              if (!read_at) {
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
                                <div>
                                  <div>
                                    <img
                                      src={user.avatar || staticUrl('/static/images/icon/icon-default-profile.png')}
                                      alt="프로필 이미지"
                                    />
                                  </div>
                                </div>
                              )}
                              <p>
                                {children}
                              </p>
                              <span className={cn('', {ring: !read_at})}>
                                {timeSince(created_at, 'YY. MM. DD')}
                              </span>
                            </div>
                          </a>
                        </Link>
                      </li>
                    )
                  } catch (err) {
                    return <Loading/>;
                  }
                })) : (
                  <AlarmNoContentLi>
                    새로운 알림이 없습니다.
                  </AlarmNoContentLi>
                )}
              {rest.next && (
                <Waypoint onEnter={() => fetchAlarm(rest.next)}>
                  <Loading/>
                </Waypoint>
              )}
            </NoticeUl>
            {(!isEmpty(ids)) && (
              <div className="read-all">
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
                            ({alarm_count, ...curr}) => ({...curr, alarm_count: 0,})
                          ));
                        }
                      })
                  }}>
                  모두 읽기
                </span>
              </div>
            )}
          </NoticeWrapperDiv>
        </>
      )}
    </>
  );
});

AlarmList.displayName = 'AlarmList';
export default AlarmList;

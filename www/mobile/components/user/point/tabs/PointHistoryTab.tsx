import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/router';
import {axiosInstance} from '@hanii/planet-apis';
import {shallowEqual, useSelector} from 'react-redux';
import PointHistoryTabArea from './style/PointHistoryTabArea';
import InfiniteScroll from '../../../InfiniteScroll/InfiniteScroll';
import Loading from '../../../common/Loading';
import PointApi from '../../../../src/apis/PointApi';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import usePrevious from '../../../../src/hooks/usePrevious';
import {numberWithCommas} from '../../../../src/lib/numbers';
import {BASE_URL, staticUrl} from '../../../../src/constants/env';
import NoContentText from '../../../NoContent/NoContentText';

const POINT_TYPE_MAP = {
  all: [
    {label: '전체', value: 'all'},
    {label: '적립', value: 'given'},
    {label: '충전', value: 'charge'},
    {label: '사용', value: 'spent'},
    {label: '환급', value: 'withdrawal'},
  ],
  history: [],
};

const POINT_TYPE_KOR = {
  all: {
    all: '전체',
    given: '적립',
    charge: '충전',
    spent: '사용',
    withdrawal: '환급',
  },
  history: {
    denied: "거절처리",
    canceled: "취소처리",
    ongoing: "신청완료",
    confirmed: "승인완료",
  },
};

const reg = new RegExp(/\{\w+\}/g);

const pointListText = (pointListType, pointItem) => {
  if (pointListType === 'all') {
    const {title, payload, point_type} = pointItem;
    const pointType = POINT_TYPE_KOR[pointListType][point_type];
    const patterns = title.match(reg);
    const segments = title.split(reg);
    const pointText = [];

    segments.forEach((seg, idx) => {
      if (seg) {
        pointText.push(<span key={seg}>{seg}</span>);
      }
      if (idx !== segments.length - 1) {
        const pattern = patterns[idx];
        const key = pattern.substring(1, pattern.length - 1);
        const currPayload = payload[key] || {};
        pointText.push(
          <strong key={currPayload.text}>{currPayload.text}</strong>,
        );
      }
    });

    return {pointType, pointText};
  } else if (pointListType === 'history') {
    const {status, won, bank} = pointItem;
    const text = `${bank} | ${numberWithCommas(won)}원 `;
    return {
      pointType: '환급',
      pointText: (
        <>
          {text}
          <span
            className={cn(
              'point-history-text',
              {on: ['ongoing', 'confirmed'].includes(status)},
            )}
          >
            {POINT_TYPE_KOR[pointListType][status]}
          </span>
        </>
      )
    };
  }
};

const INIT_POINT_LIST = {
  routeLoading: false,
  fetch: false,
  listType: {
    all: '전체 내역',
    history: '환급 신청 내역',
  },
  pointType: {
    all: {
      pointList: [],
      pointRest: {},
    },
    history: {
      pointList: [],
      pointRest: {},
    }
  },
  selectedListType: 'all',
  selectedPointListType: 'all',
};

const pointListReducer = (state, action: any = {}) => {
  const {type, payload} = action;

  switch (type) {
    case 'SET_ROUTE_LOADING':
      return {
        ...state,
        routeLoading: true,
      };
    case 'SELECT_LIST_TYPE':
      return {
        ...state,
        selectedListType: payload,
      };
    case 'SELECT_POINT_LIST_TYPE':
      return {
        ...state,
        selectedPointListType: payload,
      };
    case 'FETCH_LIST':
      return {
        ...state,
        fetch: true,
      };
    case 'SAVE_LIST':
      return {
        ...state,
        fetch: false,
        pointType: {
          ...state.pointType,
          [payload.key]: {
            pointList: [
              ...state.pointType[payload.key].pointList,
              ...payload.list,
            ],
            pointRest: payload.rest,
          },
        },
      };
    case 'CLEAR_LIST':
      return {
        ...state,
        fetch: false,
        pointType: {
          ...state.pointType,
          [payload.key]: {
            pointList: [],
            pointRest: {},
          },
        },
      };
  }
};

const PointHistoryTab = React.memo(() => {
  // State
  const [pointList, dispatchPointList] = React.useReducer(pointListReducer, INIT_POINT_LIST);
  const {routeLoading, fetch, listType, pointType, selectedListType, selectedPointListType} = pointList;
  const prevSelectedListType = usePrevious(selectedListType);
  const prevSelectedPointListType = usePrevious(selectedPointListType);

  // Redux
  const access = useSelector(
    ({system: {session: {access}}}) => access,
    shallowEqual
  );

  // Api
  const router = useRouter();
  const pointApi = useCallAccessFunc(access => new PointApi(access));

  const saveListThunk = React.useCallback(({data: {results, ...rest}}) => {
    if (!!results) {
      dispatchPointList({
        type: 'SAVE_LIST',
        payload: {key: selectedListType, list: results, rest},
      });
    }
  }, [selectedListType]);

  const fetchNextList = React.useCallback((next: string) => {
    axiosInstance({token: access, baseURL: BASE_URL})
      .get(next)
      .then(saveListThunk);
  }, [access, saveListThunk]);

  const handleChangePointListType = React.useCallback(() => {
    if (!!prevSelectedPointListType && prevSelectedPointListType !== selectedPointListType) {
      const listParams = selectedPointListType === 'all'
        ? {}
        : {point_type: selectedPointListType};
      const apiPromise = selectedListType === 'all'
        ? pointApi.list(listParams)
        : pointApi.withdrawalList(listParams);

      dispatchPointList({type: 'FETCH_LIST'});
      dispatchPointList({
        type: 'CLEAR_LIST',
        payload: {key: selectedListType},
      });

      apiPromise.then(saveListThunk);
    }
  }, [selectedListType, saveListThunk, prevSelectedPointListType, selectedPointListType]);

  const handleChangeListType = React.useCallback(() => {
    if (prevSelectedListType !== selectedListType) {
      dispatchPointList({type: 'CLEAR_LIST', payload: {key: selectedListType}});

      (selectedListType === 'all' ? pointApi.list() : pointApi.withdrawalList())
        .then(saveListThunk);
    }
  }, [saveListThunk, prevSelectedListType, selectedListType]);

  React.useEffect(() => {
    const {query: {list}} = router;

    if (list === 'point_withdrawal') {
      dispatchPointList({type: 'SELECT_LIST_TYPE', payload: 'history'});
    } else {
      // `listType`이 변경되면 `useEffect`로 인해 `API`를 호출해서 이 경우를 제외하고 초기 `API`를 호출합니다.
      pointApi.list().then(saveListThunk);
    }
    dispatchPointList({type: 'SET_ROUTE_LOADING'});
  }, [router.query, saveListThunk]);

  React.useEffect(() => {
    if (routeLoading) {
      dispatchPointList({type: 'FETCH_LIST'});
      handleChangeListType();
      handleChangePointListType();
    }
  }, [routeLoading, handleChangeListType, handleChangePointListType]);

  return (
    <PointHistoryTabArea>
      <div>
        <p>
          나의 별에 대한 <span>적립/사용/충전/환급</span> 내용을 최신순으로 확인 하실 수 있습니다.
        </p>
      </div>
      <div>
        <ul className="point-tab-details">
          {Object.keys(listType).map(key => (
            <li
              key={`point-history-${key}`}
              className={cn({on: selectedListType === key})}
              onClick={() => {
                dispatchPointList({type: 'SELECT_LIST_TYPE', payload: key});
              }}
            >
              <a>{listType[key]}</a>
            </li>
          ))}
        </ul>
        <ul className="point-tab-label">
          {POINT_TYPE_MAP[selectedListType].map(({label, value}) => (
            <li
              key={`point-type-${value}`}
              className={cn({[value]: selectedPointListType === value})}
              onClick={() => dispatchPointList({
                type: 'SELECT_POINT_LIST_TYPE',
                payload: value,
              })}
            >
              {label}
            </li>
          ))}
        </ul>

        {fetch ? (
          <Loading />
        ) : (
          isEmpty(pointType[selectedListType].pointList) ? (
            <NoContentText
              src="/static/images/icon/icon-point-null.png"
              alt="아직 별 이용 내역이 없습니다."
            >
              <p>아직 별 이용 내역이 없습니다.</p>
            </NoContentText>
          ) : (
            <InfiniteScroll
              className="infinite-scroll"
              loader={<Loading/>}
              hasMore={pointType[selectedListType].pointRest.next !== null}
              loadMore={() => {
                fetchNextList(pointType[selectedListType].pointRest.next);
              }}
              threshold="-250px"
            >
              <ul className="point-table">
                {pointType[selectedListType].pointList.map(item => {
                  const {point_type, status, amount, created_at, payload} = item;
                  const {story} = payload || {} as any;
                  const isCharge = amount > 0;
                  const {pointType, pointText} = pointListText(selectedListType, item);
                  const pointClassName = !!status ? 'withdrawal' : point_type;

                  return (
                    <li>
                      <span className="date">
                        {moment(created_at).format('YYYY.MM.DD')}
                      </span>
                      <p className="ellipsis">
                        <span className={cn('point-type', pointClassName)}>
                          {pointType}
                        </span>
                        <span>{pointText}</span>
                      </p>
                      {!!story && (
                        <Link href={`/story/${story.id}`}>
                          <a>
                            글 바로가기
                            <img
                              src={staticUrl('/static/images/icon/arrow/icon-gray-shortcut.png')}
                              alt="글 바로가기"
                            />
                          </a>
                        </Link>
                      )}
                      <strong className={cn('price', pointClassName)}>
                        {isCharge ? `+${amount}` : amount}
                      </strong>
                    </li>
                  )
                })}
              </ul>
            </InfiniteScroll>
          )
        )}
      </div>
    </PointHistoryTabArea>
  );
});

export default PointHistoryTab;

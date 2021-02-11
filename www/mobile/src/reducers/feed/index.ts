import cloneDeep from 'lodash/cloneDeep';
import {createActions, handleActions} from 'redux-actions';
import {uniq} from 'lodash';
import {userLogin, userLogout} from '../orm/user/userReducer';

export const DEFAULT_FEED_STATE = {
  error: {},
  pending: false,
  ids: []
};

export const FETCH_FEED = 'FETCH_FEED';
export const SAVE_FEED = 'SAVE_FEED';
export const ERROR_FEED = 'ERROR_FEED';
export const SAVE_LAST_READ = 'SAVE_LAST_READ';
export const FLUSH_FEED = 'FLUSH_FEED';
export const WRITE_FEED = 'WRITE_FEED';
export const DELETE_FEED_LIST = 'DELETE_FEED_LIST';

export const {
  fetchFeed,
  saveFeed,
  errorFeed,
  saveLastRead,
  flushFeed,
  writeFeed,
  deleteFeedList,
} = createActions({
  [FETCH_FEED]: (payload) => payload,
  [SAVE_FEED]: (payload) => payload,
  [ERROR_FEED]: () => ({}),
  [SAVE_LAST_READ]: (payload) => payload,
  [FLUSH_FEED]: (payload) => payload,
  [WRITE_FEED]: (payload) => payload,
  [DELETE_FEED_LIST]: (payload) => payload,
});

export const index = handleActions(
  {
    [userLogout.toString()]: () => ({...DEFAULT_FEED_STATE}),
    [userLogin.toString()]: () => ({...DEFAULT_FEED_STATE}),
    [fetchFeed.toString()]: (state: any, {payload: {key}}) => ({
      ...state,
      [key]: state[key]
        ? {
          ...state[key],
          pending: true
        }
        : {
          ...DEFAULT_FEED_STATE,
          pending: true
        }
    }),
    [saveFeed.toString()]: (state: any, {payload: {
      fetchTime,
      key,
      results,
      fetchType = 'append',
      ...rest
    }}) => {
      if(!state[key] || !state[key].fetchTime || state[key].fetchTime < fetchTime) {
        const {ids} = state[key] || {ids: []};
        const idsLength = ids.length;

        return {
          ...state,
          [key]: {
            ...(fetchType === 'overwrite'
                ? DEFAULT_FEED_STATE
                : state[key]
            ),
            ids: uniq([
              ...(fetchType === 'overwrite'
                  ? []
                  : ids
              ),
              ...(results || []).map(({id}, idx) => `${id}-${idsLength + idx}`),
            ]),
            ...rest,
            fetchTime,
            pending: false
          }
        };
      }
      return state;
    },
    [writeFeed.toString()]: (state: any, {payload: {key, result}}) => ({
      ...state,
      [key]: {
        ...state[key],
        ids: [result.id, ...state[key].ids],
      }
    }),
    [errorFeed.toString()]: (state: any, {payload: {
      key,
      err
    }}) => ({
      ...state,
      [key]: {
        ...DEFAULT_FEED_STATE,
        ...state[key],
        error: err
      }
    }),
    [saveLastRead.toString()]: (state: any, {payload: {key, lastRead}}) => ({
      ...state,
      [key]: {
        ...state[key],
        lastRead
      }
    }),
    [FLUSH_FEED.toString()]: (state: any, {payload: {
      key,
      data,
      next,
      previous
    }}) => ({
      ...state,
      [key]: {
        ...DEFAULT_FEED_STATE,
        ids: data.map(({id}) => id),
        next,
        previous,
        pending: false
      }
    }),
    [DELETE_FEED_LIST.toString()]: (state: any, {payload}) => {
      const cloned =  cloneDeep(state);

      for (const asPath in payload) {
        cloned[asPath].ids = cloned[asPath].ids.filter(item => !payload[asPath].includes(item));
      }

      return cloned;
      },
    },
  {}
);

export default index;

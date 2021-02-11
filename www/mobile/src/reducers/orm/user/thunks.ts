import UserApi from '../../../apis/UserApi';
import {MINUTE} from '../../../constants/times';
import {bulkSaveUser, saveUser, updateUser} from './userReducer';
import {timeOver} from '../../../lib/date';
import {pickUserSelector} from './selector';
import {setMyId} from '../../system/session/sessionReducer';
import {axiosInstance} from '@hanii/planet-apis';
import {LocalCache} from 'browser-cache-storage';
import moment from 'moment';
import {Dispatch} from 'redux';
import {AxiosResponse} from 'axios';
import {RootState} from '../../';
import {fetchUserList} from './userListReducer';
import {BASE_URL} from '../../../constants/env';

export const fetchUserThunk = (userPk: HashId, duration = 30 * MINUTE) =>
  (dispatch, getState) => {
    const {system: {session: {access}}, orm} = getState();

    const {retrieved_at} = pickUserSelector(userPk)(orm) || {} as any;
    if (!retrieved_at || timeOver(retrieved_at, duration)) {
      const key = `user_${userPk}`;
      const uniqId = moment(new Date()).format('hh:mm');
      const cached = LocalCache.get(uniqId, key);
      if (cached) {
        dispatch(saveUser({httpStatus: 200, ...cached}));
      } else {
        new UserApi(access).retrieve(userPk)
          .then(({data: {result}}) => {
            if (!!result) {
              dispatch(saveUser({...result, httpStatus: 200, retrieved_at: new Date().getTime()}));
              LocalCache.set(uniqId, key, result);
            }
          })
          .catch(err => dispatch(saveUser({httpStatus: err.response.status})));
      }
    }
  };

export const fetchMeThunk = (
  callback?: (m: IUser) => void,
) => (dispatch, getState) => {
  const {
    system: {
      session: {access},
    },
  } = getState();

  const save = (data: IUser) => {
    dispatch(saveUser(data));
    dispatch(setMyId(data));
    callback && callback(data);
  };

  new UserApi(access).me()
    .then(({data: {result}}) => {
      !!result && save({...result, reqStatus: 200});
    })
    .catch(err => {
      // if (err.response && err.response.status) {
      //   if (err.response.status === 410) {
      //     save({reqStatus: 410} as any as IUser);
      //     if (me === userId) {
      //       if (typeof window !== 'undefined' && window.location.pathname !== MY_PAGE_URL.auth) {
      //         // dispatch(pushPopup(InactiveModal, {}));
      //       }
      //     }
      //   }
      // }
    });
};

export const fetchUserListThunk = ({
  listKey,
  api,
  next
}: {
  listKey: string;
  api?: Promise<AxiosResponse<any>>,
  next?: string
}) => (dispatch: Dispatch, getState: () => RootState) => {
  const {
    system: {
      session: {access}
    }
  } = getState();

  dispatch(fetchUserList(listKey));

  (next
    ? axiosInstance({token: access, baseURL: BASE_URL}).get(next)
    : api
  ).then(({data: {results, ...kwargs}}) => {
    !!results && dispatch(
      bulkSaveUser(results, {
        ...kwargs,
        listKey,
        writeType: next ? 'append' : 'overwrite'
      }));
  });
};

export const unshiftSearchedThunk = (query: string) =>
  (dispatch: Dispatch, getState: () => RootState) => {
    const {system: {session: {id}}, orm} = getState();
    const {searched} = pickUserSelector(id)(orm);

    const SEARCHED_MAX_LENGTH = 10;
    const searchedData = {
      keyword: query,
      last_searched_at: new Date().toISOString()
    };

    const filteredSearched = searched.map(v => v.keyword).includes(query)
      ? searched.filter(v => v.keyword !== query)
      : searched;
    const _searched = [searchedData, ...filteredSearched].slice(0, SEARCHED_MAX_LENGTH);

    dispatch(updateUser(id, {
      searched: _searched
    }));
  };

export const cancelMeetupThunks = (userPk: HashId, applyPk: HashId, form, callback?: () => void) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    const api = new UserApi(access);
    if (access) {
      api.cancelApply(userPk, applyPk, form)
        .then(({status}) => {
          if (status === 200) {
            dispatch(updateUser(userPk));
            callback && callback()
          }
        }
      );
    }
  };

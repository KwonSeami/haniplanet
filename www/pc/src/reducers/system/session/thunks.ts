import {Dispatch} from 'redux';
import {saveUserToCookieInClient} from '../../../lib/user';
import {LocalCache} from 'browser-cache-storage';
import {destroySession} from '../../../lib/session';
import {userLogout} from '../../orm/user/userReducer';
import {clearSession, saveSession, setMyId} from './sessionReducer';
import {IMAGE_POPUP_KEY, POPUP_NOT_SHOW} from '../../../../components/layout/popup/ImagePopup/store/constants';

export const saveSessionThunk = (
  data: Indexable,
  callback?: Function,
) => (dispatch: Dispatch) => {
  const {access, refresh, id} = data;

  saveUserToCookieInClient(access, refresh);
  dispatch(saveSession({access, refresh}));
  dispatch(setMyId({id}));
  callback && callback();
};

const NOT_DELETE_LOCAL_STORAGE_KEY = [
  IMAGE_POPUP_KEY,
  POPUP_NOT_SHOW,
];

export const clearLocalDataThunk = (
  callback?: Function,
) => (dispatch: Dispatch<any>) => {
  const localCache = JSON.parse(localStorage.getItem('cache._meta'));

  if (localCache && localCache.caches) {
    for (const item of localCache.caches) {
      const cacheKey = item.substring(6);

      !NOT_DELETE_LOCAL_STORAGE_KEY.includes(cacheKey)
        && LocalCache.del(cacheKey);
    }
  }

  dispatch(clearSessionThunk(callback));
};

export const clearSessionThunk = (
  callback?: Function,
) => (dispatch: Dispatch) => {
  destroySession();
  dispatch(clearSession());
  dispatch(userLogout());
  callback && callback();
};

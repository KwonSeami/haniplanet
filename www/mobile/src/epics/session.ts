import {Observable, from, of} from 'rxjs';
import {mapTo, delay, mergeMap, map, catchError, takeUntil} from 'rxjs/operators';
import {ofType, combineEpics, StateObservable} from 'redux-observable';
import {Action} from 'redux';
import {Action as ReduxAction} from 'redux-actions';
import {axiosInstance} from '@hanii/planet-apis';
import {SAVE_SESSION, FETCH_REFRESH_TOKEN} from '../reducers/system/session/sessionReducer';
import {USER_LOGIN, USER_LOGOUT} from '../reducers/orm/user/userReducer';
import {clearLocalDataThunk, saveSessionThunk} from '../reducers/system/session/thunks';
import {HOUR} from '../constants/times';
import {BASE_URL} from '../constants/env';

const tokenRefreshEpic = (
  action$: Observable<Action>,
  state$: StateObservable<any>,
) => (
  action$.pipe(
    ofType(FETCH_REFRESH_TOKEN),
    mergeMap(({payload}: ReduxAction<any>) => {
      const {value: {system: {session}}} = state$;
      const refresh = session.refresh || payload.refresh;
      const callback = (payload || {}).callback || (() => null);

      return from(
        axiosInstance({baseURL: BASE_URL}).post('/auth/refresh/', {refresh}),
      ).pipe(
        map(({status, data}) => {
          if (status === 200) {
            return saveSessionThunk(data, callback);
          } else {
            return clearLocalDataThunk(callback);
          }
        }),
        catchError(() => [
          clearLocalDataThunk(() => location.href = '/logout'),
        ]),
      );
    }),
    takeUntil(action$.pipe(ofType(USER_LOGOUT))),
  )
);

const saveSessionEpic = (action$: Observable<Action>) => (
  action$.pipe(
    ofType(SAVE_SESSION),
    delay(2 * HOUR),
    mapTo({type: FETCH_REFRESH_TOKEN}),
  )
);

const userLoginEpic = (action$: Observable<Action>) => (
  action$.pipe(
    ofType(USER_LOGIN),
    map(({payload}) => saveSessionThunk(payload)),
  )
);

export default combineEpics(
  tokenRefreshEpic,
  saveSessionEpic,
  userLoginEpic,
);

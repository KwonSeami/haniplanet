import {
  Observable,
  from,
  of
} from 'rxjs';
import {Action} from 'redux';
import {ofType} from 'redux-observable';
import {
  mergeMap,
  map,
  catchError
} from 'rxjs/operators';
import {
  FETCH_FEED,
  ERROR_FEED,
  saveFeed
} from '../reducers/feed';
import {BaseApi} from '@hanii/planet-apis';

interface IAction {
  type: string;
  payload: any;
}

export const fetchFeedEpic = (action$: Observable<Action>): Observable<Action> => (
  action$.pipe(
    ofType(FETCH_FEED),
    mergeMap(({payload: {uri, access, key, fetchType}}: IAction) => {
      const fetchTime = new Date();

      return from(
        new BaseApi({baseURL: '', token: access, model: ''})
          .getAxios().get(uri)
      ).pipe(
        map(({data}) => saveFeed({key, fetchType, fetchTime, ...data,})),
        catchError(err =>
          of({
            type: ERROR_FEED,
            payload: {key, err},
            error: true,
          })
        ),
      );
    }),
  )
);

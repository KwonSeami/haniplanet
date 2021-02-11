import {createActions, handleActions, Action} from 'redux-actions';

export const SAVE_SESSION = 'SAVE_SESSION';
export const FETCH_REFRESH_TOKEN = 'FETCH_REFRESH_TOKEN';
export const CLEAR_SESSION = 'CLEAR_SESSION';
export const SET_MY_ID = 'SET_MY_ID';

export const {
  saveSession,
  fetchRefreshToken,
  clearSession,
  setMyId,
} = createActions({
  [SAVE_SESSION]: (payload) => payload,
  [FETCH_REFRESH_TOKEN]: (payload) => payload,
  [CLEAR_SESSION]: () => null,
  [SET_MY_ID]: (payload) => payload,
});

export const DEFAULT_SESSION: IDefaultSession = {
  access: null,
  refresh: null,
  id: null
};

const sessionReducer = handleActions(
  {
    [setMyId.toString()]: (
      state: ISystemState,
      {payload: {id}}: Action<{id: HashId}>,
    ) => ({...state, id}),
    [saveSession.toString()]: (
      state: ISystemState,
      {payload: session}: Action<IDefaultSession>,
    ) => ({...state, ...session}),
    [fetchRefreshToken.toString()]: (state: ISystemState) => state,
    [clearSession.toString()]: (state: ISystemState) => ({...state, ...DEFAULT_SESSION}),
  },
  DEFAULT_SESSION,
);

export default sessionReducer;

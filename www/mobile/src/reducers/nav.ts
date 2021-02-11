import {createActions, handleActions} from 'redux-actions';
import {axiosInstance} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

export const DEFAULT_NAV = [];

const {saveNavs} = createActions({
  SAVE_NAVS: navs => ({navs})
});

const navReducer = handleActions({
  [saveNavs.toString()]: (state, {payload: {navs}}) => {
    return navs;
  },
}, DEFAULT_NAV);

export const fetchNavsThunk = () =>
  dispatch => {
    axiosInstance({baseURL: BASE_URL}).get('/nav-tags/')
      .then(({data: {results}}) => !!results && dispatch(saveNavs(results)));
  };

export default navReducer;



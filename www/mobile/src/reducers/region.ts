import {handleActions, createActions} from 'redux-actions';
import {LocalCache} from 'browser-cache-storage';
import RegionApi from '../apis/RegionApi';
import {HOUR} from '../constants/times';

export const DEFAULT_REGION_STATE = {
  cachedAt: null,
  data: []
};

const SAVE_REGION = 'SAVE_REGION';

export const fetchRegionThunk = () => (dispatch, getState) => {
  const {system: {session: {access}}} = getState();

  const save = result => {
    dispatch(saveRegion(result));
    LocalCache.set(access, 'region', result);
  };

  const cached = LocalCache.get(access, 'region', HOUR);

  if (cached) {
    save(cached);
    return null;
  }

  new RegionApi(access).list()
    .then(({data: {result}}) => !!result && save(result));
};

const {saveRegion} = createActions({
  [SAVE_REGION]: (payload) => payload
});

const region = handleActions(
  {
    [saveRegion.toString()]: (_: any, {payload}) => ({
      cachedAt: new Date().getTime(),
      data: payload
    })
  },
  DEFAULT_REGION_STATE
);

export default region;

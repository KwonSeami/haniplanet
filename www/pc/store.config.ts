import * as Cookies from 'js-cookie';
import throttle from 'lodash/throttle';
import {applyMiddleware, createStore} from 'redux';
import {createEpicMiddleware} from 'redux-observable';
import {composeWithDevTools} from 'redux-devtools-extension';
import immutableStateInvariantMiddleware from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import {DEFAULT_ORM_STATE} from './src/reducers/orm/assets';
import {DEFAULT_SYSTEM_STATE} from './src/reducers/system/assets';
import {DEFAULT_POPUP} from './src/reducers/popup';
import {DEFAULT_TOOL_STATE} from './src/reducers/tool';
import rootReducer from './src/reducers';
import {DEFAULT_REGION_STATE} from './src/reducers/region';
import epics from './src/epics';
import {DEFAULT_MEDICAL_FIELD_STATE} from './src/reducers/medicalField';
import {DEFAULT_COMMUNITY_STATE} from './src/reducers/community';
import {DEFAULT_MAIN_STATE} from './src/reducers/main';

export const INITIAL_STATE = {
  feed: {},
  orm: DEFAULT_ORM_STATE,
  system: DEFAULT_SYSTEM_STATE,
  popup: DEFAULT_POPUP,
  skill: {},
  tool: DEFAULT_TOOL_STATE,
  question: {},
  region: DEFAULT_REGION_STATE,
  theme: {},
  hospital: {},
  profile: {},
  medicalField: DEFAULT_MEDICAL_FIELD_STATE,
  meetup: {},
  toast: [],
  community: DEFAULT_COMMUNITY_STATE,
  main: DEFAULT_MAIN_STATE,
};

const saveStoryThemeInCookie = (theme: Pick<typeof INITIAL_STATE, 'theme'>) => {
  const {type} = theme;
  const cookiedThemeType = Cookies.get('themeType');

  if (cookiedThemeType && type && cookiedThemeType !== type) {
    Cookies.remove('themeType');
    Cookies.set('themeType', type);
  } else if (!cookiedThemeType) {
    Cookies.set('themeType', type || 'preview');
  }
};

const configureStore = (initialState?) => {
  const epicMiddleware = createEpicMiddleware();
  const middleware =
    process.env.NODE_ENV !== 'production'
      ? [
        immutableStateInvariantMiddleware(),
        epicMiddleware,
        thunk,
        // logger
      ]
      : [
        epicMiddleware,
        thunk
      ];
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );

  const throttledSubscribe = throttle(() => {
    const {theme} = store.getState();
    saveStoryThemeInCookie(theme);
  }, 500);

  store.subscribe(throttledSubscribe);
  epicMiddleware.run(epics);

  return store;
};

export default configureStore;

import {$WHITE} from '../../../../styles/variables.types';
import {handleActions, createActions} from 'redux-actions';

export const DEFAULT_STYLE_STATE = {
  header: {
    layout: {
      themetype: 'black',
      fakeHeight: true,
      position: 'fixed',
      background: $WHITE,
    },
    navigation: {
      navDetail: '',
    },
  },
  footer: {
    isFooterShow: true,
  },
};

export const SET_LAYOUT = 'SET_LAYOUT';
export const SET_NAVIGATION = 'SET_NAVIGATION';
export const SET_FOOTER_SHOW = 'SET_FOOTER_SHOW';
export const CLEAR_FOOTER = 'CLEAR_FOOTER'
export const CLEAR_LAYOUT = 'CLEAR_LAYOUT';
export const CLEAR_NAVIGATION = 'CLEAR_NAVIGATION';

export const {
  setLayout,
  setNavigation,
  setFooterShow,
  clearFooter,
  clearLayout,
  clearNavigation,
} = createActions({
  [SET_LAYOUT]: (payload) => payload,
  [SET_NAVIGATION]: (payload) => payload,
  [SET_FOOTER_SHOW]: (payload) => payload,
  [CLEAR_FOOTER]: (payload) => payload,
  [CLEAR_LAYOUT]: (payload) => payload,
  [CLEAR_NAVIGATION]: (payload) => payload,
});

const styleReducer = handleActions({
  [setLayout.toString()]: (state, {payload}) => ({
    ...state,
    header: {
      ...state.header,
      layout: {
        ...state.header.layout,
        ...payload
      }
    }
  }),
  [setNavigation.toString()]: (state, {payload}: any) => ({
    ...state,
    header: {
      ...state.header,
      navigation: {
        navDetail: payload
      }
    }
  }),
  [setFooterShow.toString()]: (state, {payload}: any) => ({
    ...state,
    footer: {
      ...state.footer,
      isFooterShow: payload,
    }
  }),
  [clearLayout.toString()]: (state) => ({
    ...state,
    header: {
      ...state.header,
      layout: DEFAULT_STYLE_STATE.header.layout,
    }
  }),
  [clearNavigation.toString()]: (state) => ({
    ...state,
    header: {
      ...state.header,
      navigation: DEFAULT_STYLE_STATE.header.navigation,
    }
  }),
  [clearFooter.toString()]: (state) => ({
    ...state,
    footer: DEFAULT_STYLE_STATE.footer
  }),
}, DEFAULT_STYLE_STATE);

export default styleReducer;
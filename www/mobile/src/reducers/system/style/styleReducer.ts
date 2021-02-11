import {createActions, handleActions} from "redux-actions";
import {$WHITE} from '../../../../styles/variables.types';

export const DEFAULT_STYLE_STATE = {
  header: {
    layout: {
      headerDetail: '',
      isHeaderTitle: false,
      isSearchActive: false,
      themetype: 'black',
      fakeHeight: true,
      position: 'fixed',
      background: $WHITE
    },
  },
  footer: {
    isFooterShow: true,
  },
};

export const SET_LAYOUT = 'SET_LAYOUT';
export const SET_FOOTER_SHOW = 'SET_FOOTER_SHOW';
export const CLEAR_LAYOUT = 'CLEAR_LAYOUT';

export const {
  setLayout,
  setFooterShow,
  clearLayout,
} = createActions({
  [SET_LAYOUT]: (payload) => payload,
  [SET_FOOTER_SHOW]: (payload) => payload,
  [CLEAR_LAYOUT]: (payload) => payload,
});

const styleReducer = handleActions<>({
  [setLayout.toString()]: (
    state: ISystemState,
    {payload}
  ) => ({
    ...state,
    header: {
      ...state.header,
      layout: payload,
    }
  }),
  [setFooterShow.toString()]: (
    state: ISystemState,
    {payload}
  ) => ({
    ...state,
    footer: {
      ...state.footer,
      isFooterShow: payload
    }
  }),
  [clearLayout.toString()]: (
    state,
  ) => ({
    ...state,
    header: {
      ...state.header,
      layout: DEFAULT_STYLE_STATE.header.layout,
    }
  }),
  },
  DEFAULT_STYLE_STATE
);

export default styleReducer;
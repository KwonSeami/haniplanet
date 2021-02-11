import {createActions, handleActions} from 'redux-actions';

export interface IScrollPayload {
   [key: string]: number[];
}

const DEFAULT_SCROLL_PAYLOAD = {};

const {saveScroll} = createActions({
  'SAVE_SCROLL': payload => payload
});

const scroll = handleActions({
  [saveScroll.toString()]: (state, {payload}) => ({
    ...state,
    ...payload
  })
}, DEFAULT_SCROLL_PAYLOAD);

export const saveScrollThunk = (path: string) => dispatch => {
  dispatch(saveScroll({[path]: [window.scrollX, window.scrollY]}));
};

export default scroll;

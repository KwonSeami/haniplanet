import {Action, handleActions} from 'redux-actions';
import {v4} from 'uuid';
import {IdOfPopup, PopupPayload, PopupState} from './types';

export interface IPopupPayload extends PopupPayload {
  id: string;
}

export const PUSH_POPUP = 'PUSH_POPUP';
export const pushPopup = (
  Popup: React.ElementType,
  props?: Indexable,
  child?: React.ReactNode
): Action<PopupPayload> => ({
  type: PUSH_POPUP,
  payload: {
    id: v4(),
    Popup,
    href: location.pathname + location.search,
    props,
    child,
  },
});
export const POP_POPUP = 'POP_POPUP';
export const popPopup = (id: string): Action<IdOfPopup> => ({
  type: POP_POPUP,
  payload: {
    id,
  },
});
export const CLEAR_POPUP = 'CLEAR_POPUP';
export const clearPopup = (): Action<{}> => ({
  type: CLEAR_POPUP,
  payload: {},
});

export const DEFAULT_POPUP: IPopupPayload[] = [];

const popup = handleActions(
  {
    [PUSH_POPUP]: (state: PopupState = [], action: Action<PopupPayload>) => ([
      ...state,
      action.payload
    ]),
    [POP_POPUP]: (state: PopupState = [], {payload: {id: excludeID}}: Action<IdOfPopup>) => (
      state.filter(item => item.id !== excludeID)
    ),
    [CLEAR_POPUP]: () => DEFAULT_POPUP,
  },
    DEFAULT_POPUP,
);

export default popup;

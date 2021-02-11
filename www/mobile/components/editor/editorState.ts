import xor from 'lodash/xor';
import xorBy from 'lodash/xorBy';
import saveValueAtNameReducer from '../../src/lib/element/saveValueAtNameReducer';
import {createStore} from '../../src/hooks/useGlobalStete';


const editorStateReducer = (state, action) => {
  switch (action.type) {
    case 'FIELD':
      return saveValueAtNameReducer(state, action);
    case 'TOGGLE_FIELD':
      return {
        ...state,
        [action.field]: xor(
          state[action.field],
          action.value
        ),
      };
    case 'SAVE_OBJ':
      return {
        ...state,
        ...action.value,
      };
    case 'SAVE_OBJ_FIELD':
      return {
        ...state,
        [action.field]: saveValueAtNameReducer(state[action.field], action),
      };
    case 'SAVE_ADDITIONAL_CONTENT':
      return {
        ...state,
        additionalContent: {
          ...state.additionalContent,
          [action.field]: [
            ...state.additionalContent[action.field],
            action.value,
          ],
        },
      };
    case 'TOGGLE_ADDITIONAL_CONTENT':
      return {
        ...state,
        additionalContent: {
          ...state.additionalContent,
          [action.field]: xorBy(
            state.additionalContent[action.field],
            action.value,
            action.id,
          ),
        },
      };
    default:
      return state;
  }
};

const EDITOR_STATE = {
  user_expose_type: 'real',
  title: '',
  open_range: '',
  user_types: [],
  menu_tag_id: '',
  userInfo: {
    gender: 'female',
    age: '',
    phone: '',
  },
  additionalContent: {
    dictList: [],
    tags: [],
  },
};

export const {GlobalStateProvider, dispatch, useGlobalState} = createStore(editorStateReducer, EDITOR_STATE);

export const onChangeEditorInputAtName = ({target: {name, value}}) => {
  dispatch({type: 'FIELD', name, value});
};

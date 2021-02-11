import {createActions, handleActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../assets';
import {bulkSaveUser} from './userReducer';
import {uniq} from 'lodash';

const DEFAULT_LIST_FORMAT = {
  ids: [],
  rest: {},
  pending: false
};

export const {
  updateUserList,
  fetchUserList
} = createActions({
  UPDATE_USER_LIST: (listKey, func) => ({listKey, func}),
  FETCH_USER_LIST: (listKey) => ({listKey})
});

const userListReducer = handleActions({
  [updateUserList.toString()]: (
    state,
    {payload: {func, listKey}},
  ) => {
    const curr = state[listKey] || {...DEFAULT_LIST_FORMAT};
    return {
      ...state,
      [listKey]: {
        ...curr,
        ids: func(curr.ids),
      },
    };
  },
  [fetchUserList.toString()]: (
    state,
    {payload: {listKey}}
  ) => {
    const curr = state[listKey] || {...DEFAULT_LIST_FORMAT};

    return {
      ...state,
      [listKey]: {
        ...curr,
        pending: true
      }
    };
  },
  [bulkSaveUser.toString()]: (
    state,
    {payload: {results, kwargs: {listKey, writeType = 'append', ...rest}}},
  ) => {
    const newIds = results.map(({id}) => id);

    return {
      ...state,
      [listKey]: writeType === 'overwrite'
        ? {
          ...DEFAULT_LIST_FORMAT,
          ids: newIds,
          rest,
          pending: false
        }
        : {
          ...DEFAULT_LIST_FORMAT,
          ids: uniq([
            ...((state[listKey] || {}).ids || []),
            ...newIds,
          ]),
          rest,
          pending: false
        },
    };
  },
}, DEFAULT_ORM_STATE.tagList);

export default userListReducer;

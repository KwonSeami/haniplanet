import {handleActions, createActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../assets';
import {bulkSaveMember} from './memberReducer';
import uniq from 'lodash/uniq';

const DEFAULT_LIST_FORMAT = {
  ids: [],
  rest: {},
};

export const {
  updateMemberList
} = createActions({
  UPDATE_MEMBER_LIST: (listKey, payload) => ({listKey, payload})
});
const memberListReducer = handleActions({
  [bulkSaveMember.toString()]: (
    state,
    {payload: {results, kwargs: {listKey, writeType = 'append', ...rest}}}
  ) => {
    const newIds = results.map(({id}) => id);

    return {
      ...state,
      [listKey]: writeType === 'overwrite'
        ? { 
          ...DEFAULT_LIST_FORMAT,
          ids: newIds,
          rest
        }
        : {
          ...DEFAULT_LIST_FORMAT,
          ids: uniq([
            ...((state[listKey] || {}).ids || []),
            ...newIds,
          ]), 
          rest
        }
    };
  },
  [updateMemberList.toString()]: (
    state,
    {payload: {listKey, payload}}
  ) => {
    const curr = state[listKey] || {...DEFAULT_LIST_FORMAT};

    return {
      ...state,
      [listKey]: {
        ...(typeof payload === 'function'
          ? payload(curr)
          : {
            ...curr,
            ...payload
          }
        )
      }
    };
  }
}, DEFAULT_ORM_STATE.memberList);

export default memberListReducer;

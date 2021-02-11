import {createActions, handleActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../assets';
import {bulkSaveTag} from './tagReducer';
import { uniq } from 'lodash';

const DEFAULT_LIST_FORMAT = {
  ids: [],
  rest: {},
};

export const {
  updateTagList,
} = createActions({
  UPDATE_TAG_LIST: (listKey, func) => ({listKey, func}),
});

const tagListReducer = handleActions({
  [updateTagList.toString()]: (
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
  [bulkSaveTag.toString()]: (
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
        }
        : {
          ...DEFAULT_LIST_FORMAT,
          ids: uniq([
            ...((state[listKey] || {}).ids || []),
            ...newIds,
          ]),
          rest,
        },
    };
  },
}, DEFAULT_ORM_STATE.tagList);

export default tagListReducer;

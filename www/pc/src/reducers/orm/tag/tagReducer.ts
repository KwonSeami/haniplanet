import {handleActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../assets';
import {bulkDeleteModel, bulkSaveModel, defaultActions, deleteModel, saveModel, updateModel} from '../utils';
import {SAVE_FEED} from '../../feed';
import {cloneDeep} from 'lodash';
import {saveStory} from '../story/storyReducer';
import TagApi from '../../../apis/TagApi';

export const {
  updateTag,
  saveTag,
  delTag,
  bulkSaveTag,
  bulkDelTag,
} = defaultActions('tag');

const tagReducer = handleActions({
  [updateTag.toString()]: updateModel,
  [saveTag.toString()]: saveModel,
  [delTag.toString()]: deleteModel,
  [bulkSaveTag.toString()]: bulkSaveModel,
  [bulkDelTag.toString()]: bulkDeleteModel,
  [SAVE_FEED]: (
    state,
    {payload: {results: models}},
  ) => {
    if (models) {
      const itemsById = cloneDeep(state.itemsById);

      models.forEach(model => {
        (model.tags || []).forEach(tag => {
          const {id} = tag;

          if (!itemsById[id]){
            itemsById[id] = tag;
          } else {
            itemsById[id] = {
              ...itemsById[id],
              ...tag
            }
          }
        });
      });

      return {
        ...state,
        itemsById,
      };
    }

    return state;
  },
  [saveStory.toString()]: (
    state,
    {payload: {tags}},
  ) => {
    if (Array.isArray(tags)) {
      const itemsById = cloneDeep(state.itemsById);
      (tags || []).forEach(tag => {
        itemsById[tag.id] = tag;
      });

      return {
        ...state,
        itemsById,
      };
    }
    return state;
  },
}, DEFAULT_ORM_STATE.tag);

export const fetchTag = (id, callback) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    new TagApi(access)
      .retrieve(id)
      .then(({data: {result}}) => {
        if (result) {
          dispatch(saveTag(result));
          callback && callback(result);
        }
      });
  };


export default tagReducer;

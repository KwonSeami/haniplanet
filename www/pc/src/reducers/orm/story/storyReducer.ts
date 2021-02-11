import {handleActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../assets';
import {bulkDeleteModel, bulkSaveModel, defaultActions, deleteModel, saveModel, updateModel} from '../utils';
import {SAVE_FEED, WRITE_FEED} from '../../feed';

export const {
  updateStory,
  saveStory,
  delStory,
  bulkSaveStory,
  bulkDelStory
} = defaultActions('story');

const storyReducer = handleActions({
  [updateStory.toString()]: updateModel,
  [saveStory.toString()]: saveModel,
  [delStory.toString()]: deleteModel,
  [bulkSaveStory.toString()]: bulkSaveModel,
  [SAVE_FEED]: bulkSaveModel,
  [bulkDelStory.toString()]: bulkDeleteModel,
  [WRITE_FEED]: (state, {payload: {result}}: any) => ({
    ...state,
    items: [result.id, ...state.items],
    itemsById: {
      [result.id]: result,
      ...state.itemsById,
    },
  })
}, DEFAULT_ORM_STATE.story);

export default storyReducer;

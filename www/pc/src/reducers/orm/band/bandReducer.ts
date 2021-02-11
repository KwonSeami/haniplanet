import {handleActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../assets';
import {bulkDeleteModel, bulkSaveModel, defaultActions, deleteModel, updateModel} from '../utils';

export const {
  updateBand,
  saveBand,
  delBand,
  bulkSaveBand,
  bulkDelBand
} = defaultActions('band');

const bandReducer = handleActions({
  [updateBand.toString()]: updateModel,
  [delBand.toString()]: deleteModel,
  [bulkSaveBand.toString()]: bulkSaveModel,
  [bulkDelBand.toString()]: bulkDeleteModel,
  [saveBand.toString()]: (state, {payload}) => ({
    ...state,
    itemsById: {
      ...state.itemsById,
      [payload.slug]: payload,
    },
  }),
}, DEFAULT_ORM_STATE.band);

export default bandReducer;

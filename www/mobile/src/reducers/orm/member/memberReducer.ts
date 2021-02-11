import {handleActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../assets';
import {bulkDeleteModel, bulkSaveModel, defaultActions, deleteModel, saveModel, updateModel} from '../utils';

export const {
  updateMember,
  saveMember,
  delMember,
  bulkSaveMember,
  bulkDelMember
} = defaultActions('member');

const memberReducer = handleActions({
  [updateMember.toString()]: updateModel,
  [saveMember.toString()]: saveModel,
  [delMember.toString()]: deleteModel,
  [bulkSaveMember.toString()]: bulkSaveModel,
  [bulkDelMember.toString()]: bulkDeleteModel
}, DEFAULT_ORM_STATE.member);

export default memberReducer;

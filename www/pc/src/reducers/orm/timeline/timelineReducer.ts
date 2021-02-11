import {handleActions} from 'redux-actions';
import {cloneDeep} from 'lodash';
import {DEFAULT_ORM_STATE} from '../assets';
import {bulkDeleteModel, bulkSaveModel, defaultActions, deleteModel, saveModel, updateModel} from '../utils';
import {saveBand} from '../band/bandReducer';

export const {
  updateTimeline,
  saveTimeline,
  delTimeline,
  bulkSaveTimeline,
  bulkDelTimeline,
} = defaultActions('timeline');

const timelineReducer = handleActions({
  [updateTimeline.toString()]: updateModel,
  [saveTimeline.toString()]: saveModel,
  [delTimeline.toString()]: deleteModel,
  [bulkSaveTimeline.toString()]: bulkSaveModel,
  [bulkDelTimeline.toString()]: bulkDeleteModel,
  [saveBand.toString()]: (state, {payload: {timelines}}) => {
    const itemsById = cloneDeep(state.itemsById);
    timelines.forEach(timeline => {
      itemsById[timeline.id] = timeline;
    });

    return { ...state, itemsById };
  },
}, DEFAULT_ORM_STATE.timeline);


export default timelineReducer;

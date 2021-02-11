import {handleActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../assets';
import {saveBand} from '../band/bandReducer';

const reduceSaveBand = (state, {payload: {slug, timelines}}) => {
  const timelineIds = [];
  const sortByTimeline = {...state.sortByTimeline};

  timelines.forEach(tag => {
    const {id: tagId} = tag;
    timelineIds.push(tagId);

    const bandIds = sortByTimeline[tagId];
    if (bandIds) {
      if (bandIds.includes(slug)) { // 위 조건과 합치면 안됨
        sortByTimeline[tagId] = [...bandIds, slug];
      }
    } else {
      sortByTimeline[tagId] = [slug];
    }
  });

  return {
    ...state,
    sortByBand: { ...state.sortByBand, [slug]: timelineIds, },
    sortByTimeline,
  };
};

const bandHasTimelineReducer = handleActions({
  // [bulkSaveBand.toString()]: reduceBulkSaveBand,
  [saveBand.toString()]: reduceSaveBand,
}, DEFAULT_ORM_STATE.bandHasTimeline);

export default bandHasTimelineReducer;

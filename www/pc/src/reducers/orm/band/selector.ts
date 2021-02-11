import {isEmpty, cloneDeep} from 'lodash';

export const pickBandSelector = (id: HashId) => (orm) => {
  const {band, timeline, bandHasTimeline: {sortByBand}} = orm;
  let item = band.itemsById[id];

  if(item && !isEmpty(item)) {
    const bandTimelineIds = sortByBand[id] || [];
    const {itemsById: timelineItemsById} = timeline;

    item = cloneDeep(item);
    item.timelines = bandTimelineIds.map(timelineId => timelineItemsById[timelineId]);
  }

  return item;
};

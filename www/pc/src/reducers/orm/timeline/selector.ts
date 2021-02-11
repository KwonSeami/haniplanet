export const pickTimelineSelector = (id: HashId) => (
  ({timeline}) => timeline.itemsById[id]
);

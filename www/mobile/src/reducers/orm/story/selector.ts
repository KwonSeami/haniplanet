import {isEmpty, cloneDeep} from 'lodash';

export const pickStorySelector = (id: HashId) => (orm) => {
  const {story, tag, storyHasTag:{sortByStory}} = orm;
  let item = story.itemsById[id];

  if(item && !isEmpty(item)) {
    const storyTagIds = sortByStory[id] || [];
    const {itemsById: tagItemsById} = tag;

    item = cloneDeep(item);
    item.tags = storyTagIds.map(tagId => tagItemsById[tagId]);
  }

  return item;
};

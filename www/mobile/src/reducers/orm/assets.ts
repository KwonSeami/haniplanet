export const DEFAULT_ORM_MODEL_FORMAT = {
  items: [],
  itemsById: {},
};
export const DEFAULT_ORM_STATE = {
  story: {...DEFAULT_ORM_MODEL_FORMAT},
  tag: {...DEFAULT_ORM_MODEL_FORMAT},
  storyHasTag: {
    sortByStory: {},
    sortByTag: {}
  },
  tagList: {},
  band: {...DEFAULT_ORM_MODEL_FORMAT},
  bandHasTimeline: {
    sortByBand: {},
    sortByTimeline: {}
  },
  timeline: {...DEFAULT_ORM_MODEL_FORMAT},
  user: {...DEFAULT_ORM_MODEL_FORMAT},
  userFollowList: {
    sortByFollower: {},
    sortByFollowee: {},
  },
  userList: {},
  member: {...DEFAULT_ORM_MODEL_FORMAT},
  memberList: {}
};

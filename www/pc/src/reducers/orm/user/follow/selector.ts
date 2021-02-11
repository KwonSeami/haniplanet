export const userFollowerSelector = (id: HasId) => (orm) => {
  const {
    user: {
      itemsById: userItemsById,
    },
    userFollowList,
  } = orm;
  const {ids, rest} = userFollowList.sortByFollowee[id] || {ids: [], rest: {}};
  return [
    ids.map(currId => userItemsById[currId]),
    rest,
  ];
};
export const userFollowingSelector = (id: HasId) => (orm) => {
  const {
    user: {
      itemsById: userItemsById,
    },
    userFollowList,
  } = orm;
  const {ids, rest} = userFollowList.sortByFollower[id] || {ids: [], rest: {}};
  return [
    ids.map(currId => userItemsById[currId]),
    rest,
  ];
};

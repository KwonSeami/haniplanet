export const pickUserSelector = (id: HashId) => (orm) => {
  const {user} = orm;
  return user.itemsById[id];
};

export const userListSelector = (listKey: string) =>
  (orm) => {
    const {
      user: {itemsById},
      userList: {
        [listKey]: {
          ids: currList,
          rest,
          pending
        } = {
          ids: [],
          rest: {},
          pending: true
        },
      },
    } = orm;

    return [(currList || []).map(id => itemsById[id]), rest, pending];
  };

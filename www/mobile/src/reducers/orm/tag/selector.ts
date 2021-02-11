export const tagListSelector = (listKey: string) =>
  (orm) => {
    const {
      tag: {itemsById},
      tagList: {
        [listKey]: {
          ids: currList,
          rest
        } = {
          ids: [],
          rest: {}
        },
      },
    } = orm;
    return [(currList || []).map(id => itemsById[id]), rest];
  };

export const pickTagSelector = (tagPk: string) =>
  (orm) => {
    const {
      tag: {itemsById},
    } = orm;
    return itemsById[tagPk];
  };

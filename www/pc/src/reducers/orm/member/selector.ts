export const memberListSelector = (listKey: string) =>
  (orm) => {
    const {
      member: {itemsById},
      memberList: {
        [listKey]: {
          ids: currList,
          rest
        } = {
          ids: [],
          rest: {}
        }
      }
    } = orm;

    return [
      (currList || []).map(id => itemsById[id]),
      rest
    ];
  };

  export const pickMemberSelector = (memberPk: string) =>
    (orm) => {
      const {
        member: {itemsById}
      } = orm;

      return itemsById[memberPk];
    }
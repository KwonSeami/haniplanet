import {cloneDeep} from "lodash";

interface IRating {
  id: number;
}
interface IEdgeRatingMap {
  [id: number]: number;
}

export const makeFullEdgeRatingMap = (_edgeRatingMap: IEdgeRatingMap, ratings: IRating[]): IEdgeRatingMap => {
  if (ratings.length === Object.keys(_edgeRatingMap).length) {
    return _edgeRatingMap
  }

  const edgeRatingMap = cloneDeep(_edgeRatingMap);

  ratings.forEach(({id}) => {
    if (typeof edgeRatingMap[id] === 'undefined') {
      edgeRatingMap[id] = 0;
    }
  });

  return edgeRatingMap;
};

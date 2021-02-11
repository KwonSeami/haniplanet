import {makeFullEdgeRatingMap} from '../rating';

describe('makeFullEdgeRatingMap', () => {
  const _edgeRatingMap = {[1243]:111, [123]:124, [768]:235};

  it('ratings의 길이와 _edgeRatingMap의 길이가 같은 경우 _edgeRatingMap을 반환한다.', () => {
    const ratings = [{id: 1243}, {id: 123}, {id: 23}];
    expect(makeFullEdgeRatingMap(_edgeRatingMap, ratings)).toEqual(_edgeRatingMap);
  });

  it('ratings의 길이와 _edgeRatingMap의 길이가 다른 경우 _edgeRatingMap의 빈 값을 0으로 채워 반환한다.', () => {
    const longRatings = [{id: 1243}, {id: 123}, {id: 768}, {id:567}, {id: 256}];
    const longRatingsResult = {[1243]:111, [123]:124, [768]:235, [567]: 0, [256]: 0};
    expect(makeFullEdgeRatingMap(_edgeRatingMap, longRatings)).toEqual(longRatingsResult);
  });

});
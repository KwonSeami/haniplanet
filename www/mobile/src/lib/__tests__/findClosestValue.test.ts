import findClosestValue from '../findClosestValue';

describe('findClosestValue', () => {
  it.each([
    [
      [100, 200, 300, 400, 500],
      240,
      {index: 1, value: 200}
    ],
    [
      [1, 2, 3, 7, 9, 12, 21, 23, 27],
      15,
      {index: 5, value: 12}
    ],
    [
      [921, 1221, 2912, 3844, 3891, 4103, 5560, 5596],
      0,
      {index: 0, value: 921}
    ],
    [
      [63, 121, 912, 1844, 1891, 2303, 4560, 4596],
      -100,
      {index: 0, value: 63}
    ],
    [
      [9213, 12212, 29121, 38449, 38915, 41036, 55602, 55968],
      100000,
      {index: 7, value: 55968}
    ]
  ])('각 파라미터가 %p, %p 일 때 %p를 반환해야 한다.', (arr: number[], value: number, expected) => {
    expect(findClosestValue(arr, value)).toEqual(expected);
  });
});

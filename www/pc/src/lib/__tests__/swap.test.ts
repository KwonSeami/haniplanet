import {swapIdInArr, swapIdxInArr} from '../swap';

describe('swapIdxInArr 함수 테스트', () => {
  const data = [1, 2, 3, 4, 5];

  it('currIdx가 0보다 작거나 currIdx가 maxIdx보다 클 때 넘겨준 data 그대로 반환해야 한다.', () => {    
    const currIdx1 = -1;
    const currIdx2 = 10;
    const swapIdx = 3;
    const expectedData = [1, 2, 3, 4, 5];

    expect(swapIdxInArr(data, currIdx1, swapIdx)).toEqual(expectedData);
    expect(swapIdxInArr(data, currIdx2, swapIdx)).toEqual(expectedData);
  });

  it('swapIdx가 0보다 작거나 swapIdx가 maxIdx보다 클 때 넘겨준 data 그대로 반환해야 한다.', () => {
    const swapIdx1 = -1;
    const swapIdx2 = 10;
    const currIdx = 1;
    const expectedData = [1, 2, 3, 4, 5];

    expect(swapIdxInArr(data, currIdx, swapIdx1)).toEqual(expectedData);
    expect(swapIdxInArr(data, currIdx, swapIdx2)).toEqual(expectedData);
  });

  it('currIdx가 1이고 swapIdx가 3일 때, 1번과 3번 인덱스가 서로 바뀐 data를 반환해야 한다.', () => {
    const currIdx = 1;
    const swapIdx = 3;
    const expectedData = [1, 4, 3, 2, 5];

    expect(swapIdxInArr(data, currIdx, swapIdx)).toEqual(expectedData);
  });

  it('currIdx가 4이고 swapIdx가 0일 때, 4번과 0번 인덱스가 서로 바뀐 data를 반환해야 한다.', () => {
    const currIdx = 4;
    const swapIdx = 0;
    const expectedData = [5, 2, 3, 4, 1];

    expect(swapIdxInArr(data, currIdx, swapIdx)).toEqual(expectedData);
  });
});

describe('swapIdInArr 함수 테스트', () => {
  const data = ['A123', 'B456', 'C789', 'D!@', 'E0#'];

  it('currId가 배열 내에 존재하지 않을 때 넘겨준 data 그대로 반환해야 한다.', () => {
    const currId = 'A1B2C3';
    const swapId = 'B456';
    const expectedData = ['A123', 'B456', 'C789', 'D!@', 'E0#'];

    expect(swapIdInArr(data, currId, swapId)).toEqual(expectedData);
  });

  it('swapId가 배열 내에 존재하지 않을 때 넘겨준 data 그대로 반환햐야 한다.', () => {
    const currId = 'C789';
    const swapId = 'Banana';
    const expectedData = ['A123', 'B456', 'C789', 'D!@', 'E0#'];

    expect(swapIdInArr(data, currId, swapId)).toEqual(expectedData);
  });

  it(`currId가 'A123'이고 swapId가 'C789'일 때, 각 Id를 가지고 있는 요소의 순서가 변경된 data를 반환해야 한다.`, () => {
    const currId = 'A123';
    const swapId = 'C789';
    const expectedData = ['C789', 'B456', 'A123', 'D!@', 'E0#'];

    expect(swapIdInArr(data, currId, swapId)).toEqual(expectedData);
  });

  it(`currId가 'D!@'이고 swapId가 'E0#'일 때, 각 Id를 가지고 있는 요소의 순서가 변경된 data를 반환해야 한다.`, () => {
    const currId = 'D!@';
    const swapId = 'E0#';
    const expectedData = ['A123', 'B456', 'C789', 'E0#', 'D!@'];

    expect(swapIdInArr(data, currId, swapId)).toEqual(expectedData);
  });
});

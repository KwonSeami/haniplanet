import {objWithoutFalsyValue} from '../withoutFalsyValue';

describe('objWithoutFalsyValue 함수 테스트', () => {
  it('target을 넘겼을 때 Falsy한 값을 제외한 객체를 반환해야 한다.', () => {
    const falsyValues = {
      aa: null,
      bb: undefined,
      cc: false,
      dd: 0,
      ee: NaN,
      ff: ''
    };
    const obj = {
      a: 1,
      b: 'hello',
      c: {},
      d: [],
      e: () => {},
    };
    const withFalsyValues = {
      ...obj,
      ...falsyValues
    };

    expect(objWithoutFalsyValue(withFalsyValues)).toEqual(obj);
  });
});

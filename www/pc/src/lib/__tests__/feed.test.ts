import {makeFeedKey} from '../feed';

describe('makeFeedKey 함수 테스트', () => {

  it(`인자값이 넘어오지 않는 경우 /를 반환한다.`, () => {
    expect(makeFeedKey()).toBe('/');
  });

  it(`인자값의 마지막 문자가 /인 경우 인자값 그대로 반환한다.`, () => {
    expect(makeFeedKey('abcd/cdd/+34/')).toBe('abcd/cdd/+34/');
  });


  it(`인자값의 마지막 문자가 /가 아닌 경우 인자값 마지막에 /를 붙여서 반환한다.`, () => {
    expect(makeFeedKey('abcd/cdd/+34')).toBe('abcd/cdd/+34/');
  });
});

import {getRandomColor} from '../color';

describe('getRandomColor 함수 테스트', () => {
  it(`getRandomColor 함수 호출 시 문자열을 반환해야 한다.`, () => {
    const color = getRandomColor();

    expect(typeof color).toBe('string');
  });

  it('반환되는 문자열은 #으로 시작해야 한다.', () => {
    const color = getRandomColor();

    expect(color.startsWith('#')).toBeTruthy();
  });

  it('반환되는 문자열의 길이는 7이어야 한다.', () => {
    const color = getRandomColor();

    expect(color.length).toBe(7);
  });
});

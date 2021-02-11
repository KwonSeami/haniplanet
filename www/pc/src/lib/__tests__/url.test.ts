import {urlWithProtocol} from '../url';

describe('urlWithProtocol 함수 테스트', () => {

  //인자값이 string이 아닌 경우는 오류가 발생하므로 테스트하지 않았습니다.
  it(`urlWithProtocol 인자값으로 url형식에 맞지 않는 값이 들어갈 경우 인자값 그대로 반환한다.`, () => {
    expect(urlWithProtocol('http')).toBe('http');
  });

  it(`urlWithProtocol 인자값으로 http(https)가 포함된 문자열이 들어갈 경우 인자값 그대로 반환한다.`, () => {
    expect(urlWithProtocol('https://www.haniplanet.com')).toBe('https://www.haniplanet.com');
  });

  it(`urlWithProtocol 인자값으로 http(https)가 포함되지않은 문자열이 들어갈 경우 https를 앞에 붙인 인자값을 그대로 반환한다.`, () => {
    expect(urlWithProtocol('haniplanet.com')).toBe('https://haniplanet.com');
  });
});
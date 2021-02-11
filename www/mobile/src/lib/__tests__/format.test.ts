import {birthAutoHyphen} from '../format';

describe('birthAutoHyphen', () => {
  it.each([
    [
      '1231',
      '1231'
    ],
    [
      '961231',
      '9612-31'
    ],
    [
      '96-12-31',
      '9612-31'
    ],
    [
      '19961231',
      '1996-12-31'
    ]
  ])('각 파라미터가 %p 일 때 %p 를 반환해야 한다.', (value: string, expected) => {
    expect(birthAutoHyphen(value)).toBe(expected);
  })

  it('파라미터 타입이 "String"이 아닐 경우에는 빈 문자열을 반환해야 한다.', () => {
    expect(birthAutoHyphen(null)).toBe('');
  })
})
import {changeOrderOfKeys} from '../order';

describe('changeOrderOfKeys 함수 테스트', () => {
  it('target의 타입이 object가 아닐 때, 빈 객체를 반환해야 한다.', () => {
    const target = 'Not an object';
    const order = ['a', 'b', 'c'];

    expect(changeOrderOfKeys(target, order as any)).toEqual({});
  });

  it('order의 타입이 array가 아닌 경우 빈 객체를 반환해야 한다.', () => {
    const target = {
      a: 1,
      b: 2,
      c: 3
    };
    const order = 123;

    expect(changeOrderOfKeys(target, order as any)).toEqual({});
  });

  it('target의 key 배열 길이가 order의 길이와 같지 않을 때, target을 그대로 반환해야 한다.', () => {
    const target = {
      a: 1,
      b: 2,
      c: 3
    };
    const order = ['a', 'b'];

    expect(changeOrderOfKeys(target, order as any)).toEqual(target);
  });

  it('target의 key 배열과 order이 가지고 있는 요소들이 다를 때, target을 그대로 반환해야 한다.', () => {
    const target = {
      a: 1,
      b: 2,
      c: 3
    };
    const order = ['a', 'b', 'd'];

    expect(changeOrderOfKeys(target, order as any)).toEqual(target);
  });

  it('order 내의 요소들의 순서 처럼 target의 key 순서도 변경되어야 한다. (1)', () => {
    const target = {
      a: 1,
      b: 2,
      c: 3
    };
    const order = ['b', 'c', 'a'];
    const changed = changeOrderOfKeys(target, order as any);

    expect(Object.keys(changed)).toEqual(order);
  });

  it('order 내의 요소들의 순서 처럼 target의 key 순서도 변경되어야 한다. (2)', () => {
    const target = {
      name: 'Pewww',
      age: 21,
      gender: 'male',
      hasGirlFriend: false
    };
    const order = ['age', 'gender', 'name', 'hasGirlFriend'];
    const changed = changeOrderOfKeys(target, order as any);

    expect(Object.keys(changed)).toEqual(order);
  });
});

import {setAutoComplete, getAutoComplete, clearAutoComplete} from '../autoComplete';

describe('autoComplete Start', () => {
  const data = {
    id: 1,
    name: '한의플래닛'
  }
  it('유효하지 않는 pkId로 getAutoComplete을 실행하면 null이 반환되야 한다.', () => {
    expect(getAutoComplete('999')).toBeNull();
  })

  it('유효하지 않는 pkId로 setAutoComplete을 실행하면 null이 반환되야 한다.', () => {
    expect(setAutoComplete(null, data)).toBeNull();
  })

  it('유효하지 않는 data로 setAutoComplete을 실행하면 null이 반환되야 한다.', () => {
    setAutoComplete('1',null);

    expect(getAutoComplete('1')).toBeNull();
  })

  it('정상적인 방법으로 setAutoComplete과 getAutoComplete을 실행하면 정상적인 data를 반환해야 한다.', () => {
    setAutoComplete('2', data);

    expect(getAutoComplete('2')).toEqual(data);
  });

  it('유효한 pkId로 getAutoComplete을 실행하면 정상적인 데이터를 반환해야 한다.', () => {
    expect(getAutoComplete('2')).toEqual(data);
  })

  it('clearAutoComplete을 실행 후 getAutoComplete을 실행하면 null을 반환해야 한다.', () => {
    clearAutoComplete();
    expect(getAutoComplete('1')).toBeNull();
  })
});
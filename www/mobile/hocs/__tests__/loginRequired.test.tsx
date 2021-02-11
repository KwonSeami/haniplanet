import * as React from 'react';
import {useSelector} from 'react-redux';
import {renderHook} from '@testing-library/react-hooks';
import loginRequired from '../loginRequired';
import {render} from '@testing-library/react';

const AccessedComp = () => (
  <div>로그인 된 상태입니다.</div>
);

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

// TypeError: Cannot destructure property `asPath` of 'undefined' or 'null'. 의 에러로 인한 next/router Mocking
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/user/profile/edit',
    asPath: '/user/profile/edit?tab=additional'
  })
}));

const mockUseSelector = useSelector as jest.Mock;

describe('loginRequired 테스트', () => {
  it('access가 null일 때 Page401 반환', () => {
    mockUseSelector.mockImplementation(callback => callback({
      system: {
        session: {
          access: null
        }
      } 
    }));

    const {
      result: {
        current: {
          access
        }
      }
    } = renderHook(
      () => useSelector(({system: {session: {access}}}) => ({
        access
      }))
    );

    expect(access).toBeNull();

    const Comp = loginRequired(AccessedComp);
    const wrapper = render(<Comp/>);

    expect(wrapper.getByText('로그인 후 이용 가능한 서비스입니다.')).toBeInTheDocument();
  });

  it('access가 null이 아닐 경우(= 로그인 된 상태일 때) 받은 컴포넌트 그대로 출력', () => {
    mockUseSelector.mockImplementation(callback => callback({
      system: {
        session: {
          access: 'Access Token'
        }
      } 
    }));

    const {
      result: {
        current: {
          access
        }
      }
    } = renderHook(
      () => useSelector(({system: {session: {access}}}) => ({
        access
      }))
    );

    expect(access).not.toBeNull();

    const Comp = loginRequired(AccessedComp);
    const wrapper = render(<Comp/>);
    
    expect(wrapper.getByText('로그인 된 상태입니다.')).toBeInTheDocument();
  });
});

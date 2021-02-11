import * as React from 'react';
import Router, {NextRouter} from 'next/router';
import {fireEvent} from '@testing-library/dom';
import {RouterContext} from 'next/dist/next-server/lib/router-context';
import MeetupPage from '../../../pages/meetup';
import {renderWithRedux} from '../../../src/lib/test';
import {INITIAL_STATE} from '../../../store.config';

describe('Meetup index page', () => {
  const defaultQuery = {};

  const router = {
    route: '/meetup',
    asPath: '/meetup',
    pathname: '/meetup',
  } as any as NextRouter;

  const renderPaginationFeedWithRedux = (
    initialState = {},
    query = defaultQuery,
  ) => renderWithRedux(
    <RouterContext.Provider value={{...router, query}}>
      <MeetupPage />
    </RouterContext.Provider>,
    {initialState: {
      ...INITIAL_STATE,
      ...initialState,
    }},
  );

  it('Not Login', () => {
    const {getByText} = renderPaginationFeedWithRedux();

    getByText('로그인 후 이용 가능한 서비스입니다.')
  });

  it('Login', () => {
    const {getByText} = renderPaginationFeedWithRedux({
      system: {
        session: {id: 'test', access: 'access'}
      },
      orm: {
        user: {
          itemsById: {test: {user_type: 'doctor'}},
        }
      },
    });

    // 컴포넌트가 제대로 로드되었는지 테스트
    getByText('의 세미나/모임');
  });

  it('Selected Category', () => {
    const {getByText} = renderPaginationFeedWithRedux({
      system: {
        session: {id: 'test', access: 'access'}
      },
      orm: {
        user: {
          itemsById: {test: {user_type: 'doctor'}},
        }
      },
    }, {
      category: '교육/강연',
      meetup_status: 'ongoing',
    });

    getByText('모집중');
    getByText('교육/강연');
  });

  it('onChange SelectBox', () => {
    Router.push = jest.fn();

    const {getByText} = renderPaginationFeedWithRedux({
      system: {
        session: {id: 'test', access: 'access'}
      },
      orm: {
        user: {
          itemsById: {test: {user_type: 'doctor'}},
        }
      },
    });

    // 모집상태 SelectBox
    const statusSelectList = getByText('모집상태');
    fireEvent.click(statusSelectList);

    const statusSelectItem = getByText('모집중');
    fireEvent.click(statusSelectItem);

    expect(Router.push).toHaveBeenCalledTimes(1);

    // 카테고리 SelectBox
    const categorySelectList = getByText('카테고리');
    fireEvent.click(categorySelectList);

    const categorySelectItem = getByText('교육/강연');
    fireEvent.click(categorySelectItem);

    expect(Router.push).toHaveBeenCalledTimes(2);
  });
});
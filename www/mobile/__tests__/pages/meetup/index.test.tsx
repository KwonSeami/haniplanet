import * as React from 'react';
import {v4} from 'uuid';
import Router, {NextRouter} from 'next/router';
import {fireEvent} from '@testing-library/dom';
import {RouterContext} from 'next/dist/next-server/lib/router-context';
import MeetupPage from '../../../pages/meetup';
import {renderWithRedux} from '../../../src/lib/test';
import {INITIAL_STATE} from '../../../store.config';
import { mockStore } from '../../../src/reducers/__mocks__/store';
import { createMeetupUrl } from '../../../src/lib/meetup';

jest.mock('uuid');
v4.mockImplementation(() => 'testid');

describe('Meetup index page', () => {
  let store;
  let renderPaginationFeedWithRedux;
  let renderAccessPaginationFeedWithRedux;

  beforeEach(() => {
    const defaultQuery = {};
    const router = {
      route: '/meetup',
      asPath: '/meetup',
      pathname: '/meetup',
    } as any as NextRouter;

    const renderWithRouter = (query = defaultQuery) => (
      <RouterContext.Provider value={{...router, query}}>
        <MeetupPage />
      </RouterContext.Provider>
    );

    renderPaginationFeedWithRedux = (query = defaultQuery) => {
      store = mockStore(INITIAL_STATE);
      store.dispatch = jest.fn();

      return renderWithRedux(renderWithRouter(query), {store});
    };

    renderAccessPaginationFeedWithRedux = (query = defaultQuery) => {
      store = mockStore({
        ...INITIAL_STATE,
        system: {
          session: {id: 'test', access: 'access'}
        },
        orm: {
          user: {
            itemsById: {test: {user_type: 'doctor'}},
          }
        },
      });
      store.dispatch = jest.fn();

      return renderWithRedux(renderWithRouter(query), {store});
    };
  });

  // Main
  it('Not Login', () => {
    const {getByText} = renderPaginationFeedWithRedux();

    getByText('로그인 후 이용 가능한 서비스입니다.')
  });

  it('Login', () => {
    const {getByText} = renderAccessPaginationFeedWithRedux();

    // 컴포넌트가 제대로 로드되었는지 테스트
    getByText('의 세미나/모임');
  });

  it('Selected Category', () => {
    const {getByText} = renderAccessPaginationFeedWithRedux({
      category: '교육/강연',
      meetup_status: 'ongoing',
    });

    getByText('모집중');
    getByText('교육/강연');
  });

  it('onChange SelectBox', () => {
    Router.push = jest.fn();

    const {getByText} = renderAccessPaginationFeedWithRedux();

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

  // Header
  it('searchInput', () => {
    Router.push = jest.fn();
    const inputValue = '123';

    const {getByPlaceholderText} = renderAccessPaginationFeedWithRedux();

    const searchInput = getByPlaceholderText('세미나/모임 내 상세 검색');
    const nextUrl = createMeetupUrl({}, {page: 1, q: inputValue});

    // onChange 테스트
    fireEvent.change(searchInput, {target: {value: inputValue}});
    expect(searchInput).toHaveAttribute('value', inputValue);

    // Enter Key Press 테스트
    fireEvent.keyPress(searchInput, { key: "Enter", code: 13, charCode: 13 });
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith(nextUrl, nextUrl, {shallow: true});
  });

  it('click write meetup btn', async () => {
    const {getByText} = renderAccessPaginationFeedWithRedux();
    fireEvent.click(getByText('개설하기'));

    // PushPopup에 대한 Coverage가 올라가지 않음
  });
});

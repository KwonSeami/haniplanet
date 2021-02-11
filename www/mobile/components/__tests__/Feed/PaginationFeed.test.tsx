import * as React from 'react';
import Router, {NextRouter} from 'next/router';
import {fireEvent} from '@testing-library/react';
import {RouterContext} from 'next/dist/next-server/lib/router-context';
import Meetup2 from '../../meetup/Meetup2';
import PaginationFeed from '../../Feed/PaginationFeed';
import {makeFeedKey} from '../../../src/lib/feed';
import {renderWithRedux} from '../../../src/lib/test';
import {createMeetupUrl} from '../../../src/lib/meetup';
import {paginationFeedReduxStore} from './PaginationFeedStore';
import {INITIAL_STATE} from '../../../store.config';

describe('PaginationFeed Component', () => {
  const defaultQuery = {};
  const router = {
    route: '/meetup',
    asPath: '/meetup',
    pathname: '/meetup',
    query: defaultQuery,
  } as any as NextRouter;

  const renderPaginationFeedWithRedux = (
    initialState = {},
    fetchURI = '',
  ) => renderWithRedux(
    <RouterContext.Provider value={router}>
      <PaginationFeed
        className="pagination-feed"
        component={Meetup2}
        fetchURI={fetchURI}
      />
    </RouterContext.Provider>,
    {initialState: {
        ...INITIAL_STATE,
        ...initialState,
      }},
  );

  it('Loading', () => {
    const {getByAltText} = renderPaginationFeedWithRedux();

    getByAltText('피드를 불러오는 중입니다.');
  });

  it('NoContent', () => {
    const {getByText} = renderPaginationFeedWithRedux({
      feed: {
        [makeFeedKey('/meetup')]: {
          count: 0,
          ids: [],
          pending: false,
        },
      },
    });

    getByText('작성된 글이 없습니다.');
  });

  it('Data List', () => {
    Router.push = jest.fn();
    const {getByText} = renderPaginationFeedWithRedux(
      paginationFeedReduxStore(),
      'https://api.huplanet.kr/meetup/?category=&meetup_status=&page=1&place=&q=',
    );

    // Pagination Component Load
    const query = {page: 2};
    const nextPage = getByText('02');
    const nextUrl = createMeetupUrl(defaultQuery, query);
    const locationUrl = {pathname: '/', query};

    // Pagination Component Click
    fireEvent.click(nextPage);
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith(locationUrl, nextUrl, {shallow: true});
  });

  it('Cached Data List', () => {
    const {getByAltText} = renderPaginationFeedWithRedux(
      paginationFeedReduxStore(new Date('2020-04-24T03:03:02.525Z')),
      'https://api.huplanet.kr/meetup/?category=&meetup_status=&page=1&place=&q=',
    );

    getByAltText('피드를 불러오는 중입니다.');
  });
});
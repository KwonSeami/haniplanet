import Router from 'next/router';
import {createMeetupUrl, changeFirstPageUrl} from '../meetup';

describe('createMeetupUrl', () => {
  it('prevQuery, query type is not object', () => {
    expect(createMeetupUrl(1 as any, 2 as any))
      .toStrictEqual({pathname: '/meetup', query: {}});
  });

  it('prevQuery, query type is object', () => {
    expect(createMeetupUrl(
      {prevQuery: 'prevQuery', query: 'prev'},
      {query: 'next'}
    )).toStrictEqual({
      pathname: '/meetup',
      query: {prevQuery: 'prevQuery', query: 'next'},
    });
  });
});

describe('changeFirstPageUrl', () => {
  Router.push = jest.fn();

  it('prevQuery, query type is not object', () => {
    changeFirstPageUrl(1 as any, 2 as any);
    const nextUrl = createMeetupUrl(1 as any, {page: 1});

    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith(nextUrl, nextUrl, {shallow: true});
  });

  it('prevQuery, query type is object', () => {
    changeFirstPageUrl({prevQuery: 'prevQuery', query: 'prev'}, {query: 'next'});
    const nextUrl = createMeetupUrl(
      {prevQuery: 'prevQuery', query: 'prev'},
      {page: 1, query: 'next'},
    );

    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith(nextUrl, nextUrl, {shallow: true});
  });
});
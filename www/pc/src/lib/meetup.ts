import Router from 'next/router';
import isPlainObject from 'lodash/isPlainObject';

export const createMeetupUrl = (prevQuery: Indexable, query: Indexable) => ({
  pathname: '/meetup',
  query: {
    ...(isPlainObject(prevQuery) ? prevQuery : {}),
    ...(isPlainObject(query) ? query : {}),
  },
});

export const changeFirstPageUrl = (prevQuery: Indexable, query: Indexable) => {
  const nextUrl = createMeetupUrl(
    prevQuery,
    {page: 1, ...(isPlainObject(query) ? query : {})},
  );

  Router.push(nextUrl, nextUrl, {shallow: true});
};
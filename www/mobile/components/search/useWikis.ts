import * as React from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {WIKIS} from '../../src/gqls/wiki';

const useWikis = (query: string) => {
  const PAGE_SIZE = 20;
  const [page, setPage] = React.useState(0);
  const [_getWiki,{
    data: {wikis} = {wikis: {nodes: [], total_count: 0}}
  }] = useLazyQuery(WIKIS)

  const getWiki = React.useCallback(() => {
    setPage(curr => curr + 1)
    _getWiki({
      variables: {
        q: query,
        offset: page * PAGE_SIZE,
        limit: (page + 1) * PAGE_SIZE
      }
    });
  }, [query, page]);

  React.useEffect(() => {
    getWiki();
  },[getWiki]);

  return {wikis, page, PAGE_SIZE, getWiki};
}

export default useWikis;
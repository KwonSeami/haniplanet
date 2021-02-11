import * as React from 'react';
import SearchApi from '../../src/apis/SearchApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {axiosInstance} from '@hanii/planet-apis';
import {BASE_URL} from '../../src/constants/env';

interface IBandRest extends IRest {
  pending: boolean
}

const useBandSearch = <T>(query: string) => {
  const [{bandList, bandRest}, setBand] = React.useState<{
    bandList: T[],
    bandRest: IBandRest
  }>({
    bandList: [],
    bandRest: {
      pending: true,
    }
  });

  const searchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));

  const getBands = React.useCallback(({bandType, next, offset, limit}: {
    bandType: string,
    next?: string,
    offset?: number,
    limit?: number
  }) => {
    (next
      ? axiosInstance({baseURL: BASE_URL}).get(next)
      : searchApi.band(query, bandType, offset, limit)
    ).then(({data: {results, ...rest}}) => {
      !!results && setBand(curr => ({
        bandList: [...curr.bandList, ...results],
        bandRest: {
          pending: false,
          ...rest
        }
      }))
    }).catch(error => {
      console.error(error);
      setBand(curr => ({
        bandList: [],
        bandRest: {
          pending: false,
          ...curr.bandRest
        }
      }))
    })
  }, [query]);

  return {
    bandList,
    bandRest,
    getBands
  };
};

export default useBandSearch;

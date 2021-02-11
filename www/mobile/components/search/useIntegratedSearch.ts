import * as React from 'react';
import SearchApi from '../../src/apis/SearchApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {axiosInstance} from '@hanii/planet-apis';
import {BASE_URL} from '../../src/constants/env';

interface IIntegratedSearchState<T = any> {
  bandList: T[];
  bandRest: IRest;
}
interface IBandParams {
  bandType: string;
  next?: string;
  page?: number;
  limit?: number;
}

const useIntegratedSearch = <T = any>(query: string) => {
  const [{bandList, bandRest}, setBand] = React.useState<IIntegratedSearchState<T>>({
    bandList: [],
    bandRest: {pending: true} as any,
  });

  const searchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));

  const getBands = React.useCallback(({bandType, next, page, limit}: IBandParams) => {
    (next
      ? axiosInstance({baseURL: BASE_URL}).get(next)
      : searchApi.band(query, bandType, (page - 1) * limit, limit)
    ).then(({data: {results, ...rest}}) => {
      !!results && setBand(curr => ({
        bandList: [...curr.bandList, ...results],
        bandRest: rest,
      }));
    });
  }, [query]);

  return {
    bandList,
    bandRest,
    getBands
  };
};

export default useIntegratedSearch;

import * as React from 'react';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import HospitalApi from '../../src/apis/HospitalApi';
import SearchTab from './SearchTab';
import HospitalItem from "../hospital/HospitalItem";
import {SearchTopWrapperDiv, SearchContentDiv, SearchTitle, StyledPagination} from './index';
import Loading from '../common/Loading';
import isEmpty from 'lodash/isEmpty';
import {numberWithCommas} from '../../src/lib/numbers';
import {ISearchProps} from '../../src/@types/search';
import SearchNoContentText from './SearchNoContent';

const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 10;

const SearchHospitalMobile: React.FC<ISearchProps> = ({
  query,
  page,
  setURL
}) => {
  const hospitalApi = useCallAccessFunc(access => new HospitalApi(access));
  const currPage = Number(page) || 1;
  const [{pending, count, hospitals}, setData] = React.useState({
    pending: true,
    count: 0,
    hospitals: []
  });

  // API 호출
  React.useEffect(() => {
    setData(curr => ({...curr, pending: true}));
    hospitalApi.search(query, (currPage - 1) * PAGE_SIZE, PAGE_SIZE)
      .then(({data: {results, ...rest}}) => {
        setData({
          hospitals: results,
          pending: false,
          ...rest
        });
      }).catch(() => {
        setData(curr => ({...curr, pending: false}));
      });
  }, [query, currPage]);

  return (
    <SearchContentDiv>
      <SearchTopWrapperDiv>
        <SearchTab/>
        <div className="count">
          <p>
            <span>{numberWithCommas(count)}건</span>
            의 검색결과
          </p>
        </div>
      </SearchTopWrapperDiv>
      {pending ? (
        <Loading/>
      ) : !isEmpty(hospitals) ? (
        <div>
          <SearchTitle>한의원</SearchTitle>
          <ul>
            {hospitals.map(({slug, ...rest}) => (
              <li key={slug}>
                <HospitalItem
                  slug={slug}
                  {...rest}
                />
              </li>
            ))}
          </ul>
          <StyledPagination
            className="pagination"
            currentPage={currPage}
            pageSize={PAGE_SIZE}
            totalCount={count}
            pageGroupSize={PAGE_GROUP_SIZE}
            onClick={page => {
              setURL(param => ({
                ...param,
                page
              }))
            }}
          />
        </div>
      ) : (
        <SearchNoContentText/>
      )}
    </SearchContentDiv>
  );
};

SearchHospitalMobile.displayName = 'SearchHospitalMobile';

export default React.memo(SearchHospitalMobile);

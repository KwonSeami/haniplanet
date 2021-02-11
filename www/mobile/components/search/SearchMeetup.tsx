import * as React from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {$BORDER_COLOR} from '../../styles/variables.types';
import Meetup2 from '../meetup/Meetup2';
import {SearchTopWrapperDiv, SearchContentDiv, SearchTitle, StyledPagination} from './index';
import SearchApi from '../../src/apis/SearchApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import SearchTab from './SearchTab';
import {numberWithCommas} from '../../src/lib/numbers';
import Loading from '../common/Loading';
import {ISearchProps} from '../../src/@types/search';
import SearchNoContentText from './SearchNoContent';

export const StyledMeetup2 = styled(Meetup2)`
  margin-top: 0;
  padding: 15px 0;
  border-bottom: 1px solid ${$BORDER_COLOR};
  
  @media screen and (max-width: 680px) {
    padding: 15px;
  }

  @media screen and (min-width: 680px) {
    .title {
      min-height: auto;

      .img {
        width: 159px;
        height: 106px;
      }

      .title-text {
        margin-left: 179px;
      }
    }

    .contents {
      margin-left: 179px;
      padding-top: 8px;
    }
  }

  .contents {
    > ul {
      > li {
        display: inline-block;

        &:last-child {
          display: none;
        }
      }
    }
  }
`;

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 10;

const SearchMeetup: React.FC<ISearchProps> = ({
  query,
  page,
  setURL
}) => {
  const searchApi = useCallAccessFunc(access => new SearchApi(access));
  const currPage = Number(page) || 1;
  const [{pending, count, feeds,}, setData] = React.useState({
    pending: true,
    count: 0,
    feeds: []
  });

  // API 호출
  React.useEffect(() => {
    setData(curr => ({...curr, pending: true}));
    searchApi.meetup(query, (currPage - 1) * PAGE_SIZE, PAGE_SIZE)
      .then(({data: {results, ...rest}}) => {
        setData({
          feeds: results,
          pending: false,
          ...rest
        })
      })
      .catch(() => setData(curr => ({...curr, pending: false})));
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
      ) : !isEmpty(feeds) ? (
        <div>
          <SearchTitle>세미나/모임</SearchTitle>
          <ul className="clearfix">
            {feeds.map((props, idx) => (
              <StyledMeetup2
                key={idx}
                {...props}
              />
            ))}
          </ul>
          {/* TODO: pagination 기능 추가 해주세요. /10개씩 */}
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

SearchMeetup.displayName = 'SearchDictPC';
export default React.memo(SearchMeetup);
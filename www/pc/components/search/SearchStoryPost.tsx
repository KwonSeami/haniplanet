import * as React from 'react';
import AdditionalContent from '../layout/AdditionalContent';
import {FeedContentDiv, LeftFeed, FeedTitle, StyledSelectBox, StyledPagination} from './styleCompPC';
import {numberWithCommas} from '../../src/lib/numbers';
import SearchRank from './SearchRank';
import Loading from '../common/Loading';
import isEmpty from 'lodash/isEmpty';
import SearchApi from '../../src/apis/SearchApi';
import {ISearchProps} from '../../src/@types/search';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import SearchItem from '../../components/search/SearchItem';
import styled from 'styled-components';
import {$GRAY} from '../../styles/variables.types';
import Link from 'next/link';
import SearchNoContentText from './SearchNoContent';

const PostList = styled.ul`
  border-top: 1px solid ${$GRAY};
`;


const orders = [
  {value: '-created_at', label: '최신순'},
  {value: '-retrieve_count', label: '조회순'},
  {value: '-up_count', label: '인기순'}
];

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 10;

const SearchStoryPost: React.FC<ISearchProps> = ({
  query,
  page,
  order_by = null,
  setURL
}) => {
  const searchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));
  const currPage = Number(page) || 1;
  const [{pending, count, stories}, setData] = React.useState({
    pending: true,
    count: 0,
    stories: []
  });

  React.useEffect(() => {
    setData(curr => ({...curr, pending: true}));
    searchApi.story(query, (currPage - 1) * PAGE_SIZE, order_by, PAGE_SIZE)
      .then(({data: {count, results, ...rest}}) => {
        setData({
          pending: false,
          count: count,
          stories: results,
          ...rest
        });
      }).catch(() => {
        setData(curr => ({...curr, pending: false}));
      });
  }, [query, page, order_by]);

  return (
    <FeedContentDiv className="clearfix">
      <LeftFeed>
        {pending ? (
          <Loading/>
        ) : (
          !isEmpty(stories) ? (
            <>
              <FeedTitle>
                피드
                <p className="list-conut">
                  <span>{`${numberWithCommas(count)}건`}</span>
                  의 검색결과
                </p>
                <StyledSelectBox
                  value={order_by}
                  option={orders}
                  placeholder={orders.filter(({value}) => value === order_by).length 
                    ? orders.map(({value}) => value === order_by)[0].label 
                    : '결과 내 검색'}
                  onChange={value => {
                    setURL(param => ({
                      ...param,
                      page: 1,
                      order_by: value,
                    }))
                  }}            
                />
              </FeedTitle>
              <PostList>
                {stories.map(({id, ...props}) => (
                  <Link
                    key={id}
                    href="/story/[id]"
                    as={`/story/${id}`}
                  >
                    <a>
                      <SearchItem
                        highlightKeyword={query}
                        {...props}
                      />
                    </a>
                  </Link>
                  
                ))}
              </PostList>
              <StyledPagination
                className="pagination"
                currentPage={currPage}
                pageSize={PAGE_SIZE}
                totalCount={count}
                pageGroupSize={PAGE_GROUP_SIZE}
                onClick={page => {
                  if(page !== currPage) {
                    setURL(param => ({
                      ...param,
                      page
                    }))
                  }
                }}
              />
            </>
          ) : (
            <SearchNoContentText/>
          )
        )}
      </LeftFeed>
      <AdditionalContent>
        <SearchRank
          title="인기 검색어"
          api={() => searchApi.rank()}
        />
      </AdditionalContent>
    </FeedContentDiv>
  );
};

SearchStoryPost.displayName = 'SearchStoryPost';

export default React.memo(SearchStoryPost);

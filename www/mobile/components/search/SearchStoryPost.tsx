import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import SearchItem from './SearchItem';
import {SearchTopWrapperDiv, SearchContentDiv, SearchTitle, StyledPagination} from './index';
import SearchApi from '../../src/apis/SearchApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {numberWithCommas} from '../../src/lib/numbers';
import SelectBox from '../inputs/SelectBox';
import SearchTab from './SearchTab';
import styled from 'styled-components';
import {heightMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../styles/variables.types';
import Loading from '../common/Loading';
import Link from 'next/link';
import {ISearchProps} from '../../src/@types/search';
import SearchNoContentText from './SearchNoContent';

const StyledSelectBox = styled(SelectBox)`
  position: absolute;
  width: 110px;
  top: 0;
  right: 0;
  border: 0;

  @media screen and (max-width: 680px) {
    right: 8px;
  }

  p {
    ${heightMixin(39)};
    padding-left: 15px;

    img {
      right: 2px;
    }
  }

  ul {
    margin-top: 0;

    li {
      font-weight: normal;
      box-sizing: border-box;
      
      &:first-child {
        border-top: 1px solid ${$BORDER_COLOR};
      }
    }
  }
`;

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 10;

const orders = [
  {value: '-created_at', label: '최신순'},
  {value: '-retrieve_count', label: '조회순'},
  {value: '-up_count', label: '인기순'}
];

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
      })
   
  }, [query, currPage, order_by]);

  return (
    <SearchContentDiv>
      <SearchTopWrapperDiv>
        <SearchTab/>
        <div className="count">
          <p>
            <span>{numberWithCommas(count)}건</span>
            의 검색결과
          </p>
          <StyledSelectBox
            value={order_by as string}
            option={orders}
            placeholder={orders.filter(({value}) => value === order_by).length 
            ? orders.map(({value}) => value === order_by)[0].label 
            : '결과 내 검색'}
            onChange={value => {
              setURL(param => ({
                ...param,
                page: 1,
                order_by: value
              }))
            }}
          />
        </div>
      </SearchTopWrapperDiv>
      {pending ? (
        <Loading/>
      ) : (
        !isEmpty(stories) ? (
          <div>
            <SearchTitle>피드</SearchTitle>
            <ul>
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
        )
      )}
    </SearchContentDiv>
  );
};

SearchStoryPost.displayName = 'SearchDictPC';
export default React.memo(SearchStoryPost);
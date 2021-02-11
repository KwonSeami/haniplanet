import * as React from 'react';
import {NoContentText} from '../Feed';
import AdditionalContent from '../layout/AdditionalContent';
import {FeedContentDiv, LeftFeed, FeedTitle, StyledSelectBox, StyledPagination} from './styleCompPC';
import {staticUrl} from '../../src/constants/env';
import {numberWithCommas} from '../../src/lib/numbers';
import SearchRank from './SearchRank';
import Loading from '../common/Loading';
import isEmpty from 'lodash/isEmpty';
import SearchApi from '../../src/apis/SearchApi';
import {Props} from './index';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import SearchItem from '../../components/search/SearchItem';
import styled from 'styled-components';
import {$GRAY} from '../../styles/variables.types';
import Link from 'next/link';

const FeedListUl = styled.ul`
  border-top: 1px solid ${$GRAY};
`;


const orders = [
  {value: '-created_at', label: '최신순'},
  {value: '-retrieve_count', label: '조회순'},
  {value: '-up_count', label: '인기순'}
];

const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 10;

const SearchStoryPC: React.FC<Props> = React.memo(({
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
    searchApi.story(query, (currPage - 1) * PAGE_SIZE, order_by, PAGE_SIZE)
      .then(({data: {count, results, ...rest}}) => {
        setData({
          pending: false,
          count: count,
          stories: results,
          ...rest,
        });
      }).catch(() => {
        setData(curr => ({...curr, pending: false}));
      })
   
  }, [query, currPage, order_by]);

  return (
    <FeedContentDiv className="clearfix">
      <LeftFeed>
        {pending ? (
          <Loading/>
        ) : !isEmpty(stories) ? (
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
                placeholder={orders.filter(({value}) => value === order_by).length ? orders.map(({value}) => value === order_by)[0].label : '결과 내 검색'}
                onChange={value => {
                  setURL(param => ({
                    ...param,
                    order_by: value,
                  }))
                }}            
              />
            </FeedTitle>
            <FeedListUl>
              {stories.map(({id, ...props}) => (
                <Link
                  key={id}
                  href={`/story/${id}`}
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
            </FeedListUl>
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
                    offset: page
                  }))
                }
              }}
            />
          </>
        ) : (
          <NoContentText>
            <img
              src={staticUrl('/static/images/icon/icon-no-content.png')}
              alt="작성된 글이 없습니다."
            />
            작성된 글이 없습니다.
          </NoContentText>
        )}        
      </LeftFeed>
      <AdditionalContent>
        {/* TODO: 인기검색어 컴포넌트 입니다. */}
        <SearchRank
          title="인기 검색어"
          api={() => searchApi.rank()}
        />
        {/*
          TODO: 전체 글 : 기존 사용하던 캘린더 라이브러리가 추가되어야합니다
          <SearchMenuDiv>
            <h2>
              <img
                src={staticUrl("/static/images/icon/icon-sort.png")}
                alt="결과내 검색"
              />
              결과 내 검색
            </h2>
            <ul>
              <li>
                <Link
                  className="on"
                  to=""
                >
                  전체 최신순
                  <span>{`30`}</span>
                </Link>
              </li> 
              <li>
                <Link to="">
                  세미나/모임
                <span>{`20`}</span>
                </Link>
              </li>
              <li>
                <Link to="">
                  온라인 상담<span>{`1`}</span>
                </Link>
              </li>
            </ul>
          </SearchMenuDiv>
          <SearchMenuDiv>
            <h2>
              <img
                src={staticUrl("/static/images/icon/icon-day.png")}
                alt="기간 검색"
              />
              기간 검색
            </h2>
            <ul>
              <li>
                <Link
                  className="on"
                  to=""
                >
                  일주일 이내
                </Link>
              </li>
              <li>
                <Link to="">
                  한 달 이내
                </Link>
              </li>
              <li>
                <Link to="">
                  기간설정
                  <span>
                    <img
                      src={staticUrl("/static/images/icon/arrow/icon-mini-shortcuts.png")}
                      alt="기간설정 열기"
                    />
                  </span>
                </Link>
                <div>
                  <ul>
                    <li>
                      <img
                        src={staticUrl("/static/images/icon/icon-calendar.png")}
                        alt="날짜선택"
                      />
                      2019.07.08
                    </li>
                    <li>
                      <img
                        src={staticUrl("/static/images/icon/icon-calendar.png")}
                        alt="날짜선택"
                      />
                      2019.07.08
                    </li>
                    <li>
                      <Button
                        size={{
                          width: '65px',
                          height: '25px'
                        }}
                        font={{
                          size: '11px',
                          weight: 'bold'
                        }}
                        border={{
                          width: '1px',
                          color: $FONT_COLOR,
                          radius: '0'
                        }}
                      >
                        확인
                      </Button>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </SearchMenuDiv>
        */
       }
      </AdditionalContent>
    </FeedContentDiv>
  );
});

SearchStoryPC.displayName = 'SearchStoryPC';

export default SearchStoryPC;

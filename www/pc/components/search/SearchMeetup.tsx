import * as React from 'react';
import styled from 'styled-components';
import {
  FeedContentDiv, 
  LeftFeed, 
  FeedTitle, 
  StyledMeetup2, 
  StyledPagination, 
  ShortcutBox} from './styleCompPC';
import isEmpty from 'lodash/isEmpty';
import {staticUrl} from '../../src/constants/env';
import AdditionalContent from '../layout/AdditionalContent';
import {numberWithCommas} from '../../src/lib/numbers';
import Link from 'next/link';
import Loading from '../common/Loading';
import {ISearchProps} from '../../src/@types/search';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import SearchApi from '../../src/apis/SearchApi';
import SearchNoContentText from './SearchNoContent';

const StyledFeedContentDiv = styled(FeedContentDiv)`
  .seminar {
    margin-top: -10px;
  }
`;

const PAGE_SIZE = 15;
const PAGE_GROUP_SIZE = 10;

const SearchMeetup: React.FC<ISearchProps> = ({
  query,
  page,
  setURL,
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
        setData({feeds: results, pending: false, ...rest});
      }).catch(() => {
        setData(curr => ({...curr, pending: false}));
      });
  }, [query, page]);

  return (
    <StyledFeedContentDiv className="clearfix">
      <LeftFeed>
        {pending ? (
          <Loading/>
        ) : !isEmpty(feeds) ? (
          <>
            <FeedTitle>
              세미나/모임
              <p className="list-conut">
                <span>{`${numberWithCommas(count)}건`}</span>
                의 검색결과
              </p>
            </FeedTitle>
              <ul className="clearfix seminar">
                {feeds.map((props, idx) => (
                  <StyledMeetup2
                    key={idx}
                    {...props}
                  />
                ))}
              </ul>
              <StyledPagination
                className="pagination"
                currentPage={currPage}
                pageSize={PAGE_SIZE}
                totalCount={count}
                pageGroupSize={PAGE_GROUP_SIZE}
                onClick={page => setURL(param => ({...param, page}))}
              />
            </>
        ) : (
          <SearchNoContentText/>
        )}
      </LeftFeed>
      <AdditionalContent>
        <ShortcutBox
          ImgBg={staticUrl('/static/images/icon/icon-Shortcut-meetup.png')}
        >
          <p>
            <span>잠깐!</span> 어떤 세미나/모임을 찾으시나요?<br/>
            자유롭게 세미나를 <span>검색하고 개설하고 관리</span>해보세요!
          </p>
          <Link href="/meetup">
            <a>
              세미나/모임 서비스 바로가기
              <img
                src={staticUrl('/static/images/icon/arrow/icon-gray-shortcuts.png')}
                alt="세미나/모임 서비스 바로가기"
              />
            </a>
          </Link>
        </ShortcutBox>
      </AdditionalContent>
    </StyledFeedContentDiv>
  );
};

SearchMeetup.displayName = 'SearchDictPC';
export default React.memo(SearchMeetup);
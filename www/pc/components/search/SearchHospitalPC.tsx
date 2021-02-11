import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {staticUrl} from '../../src/constants/env';
import AdditionalContent from '../layout/AdditionalContent';
import Loading from '../common/Loading';
import {FeedContentDiv, LeftFeed, ShortcutBox, FeedTitle, StyledPagination} from './styleCompPC';
import {HospitalItem, HospitalListUl} from '../hospital/HospitalItem';
import Link from 'next/link';
import {numberWithCommas} from '../../src/lib/numbers';
import {ISearchProps} from '../../src/@types/search';
import HospitalApi from '../../src/apis/HospitalApi';
import BandApi from '../../src/apis/BandApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import SearchNoContentText from './SearchNoContent';

const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 10;

const SearchHospitalPC: React.FC<ISearchProps> = ({
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
  const [totalCount, setTotalCount] = React.useState(0);

  // API 호출
  React.useEffect(() => {
    setData(curr => ({...curr, pending: true}));
    hospitalApi.search(query, (currPage - 1) * PAGE_SIZE, PAGE_SIZE)
      .then(({data: {results, ...rest}}) => {
        setData({hospitals: results, pending: false, ...rest});
      }).catch(() => {
        setData(curr => ({...curr, pending: false}));
      });
    
    new BandApi().count('hospital')
      .then(({data: {result: {count}}}) => {
        setTotalCount(count);
      });
  }, [query, page]);

  return (
    <FeedContentDiv className="clearfix">
      <LeftFeed>
        {pending ? (
          <Loading/>
        ) : !isEmpty(hospitals) ? (
          <>
            <FeedTitle>
              한의원
              <p className="list-conut">
                <span>{`${numberWithCommas(count || 0)}건`}</span>
                의 검색결과
              </p>
            </FeedTitle>
            <HospitalListUl>
              {hospitals.map(({slug, ...rest}) => (
                <li key={slug}>
                  <HospitalItem
                    slug={slug}
                    highlightKeyword={query}
                    {...rest}
                  />
                </li>
              ))}
            </HospitalListUl>
            <StyledPagination
              className="pagination"
              currentPage={currPage}
              pageSize={PAGE_SIZE}
              totalCount={count}
              pageGroupSize={PAGE_GROUP_SIZE}
              onClick={page => {
                if (page !== currPage) {
                  setURL(param => ({...param, page}));
                }
              }}
            />
          </>
        ) : (
          <SearchNoContentText/>
        )}
      </LeftFeed>
      <AdditionalContent>
        <ShortcutBox
          ImgBg={staticUrl('/static/images/icon/icon-Shortcut-hospital.png')}
        >
          <p>
            <span>잠깐!</span> 어떤 한의원을 찾으시나요?<br/>
            한의플래닛에는 <span>{totalCount}</span>개의 한의원이 등록되어 있습니다.
          </p>
          <Link href="/hospital">
            <a>
              맞춤형 한의원 찾기 서비스 바로가기
              <img
                src={staticUrl('/static/images/icon/arrow/icon-gray-shortcuts.png')}
                alt="맞춤형 한의원 찾기 서비스 바로가기"
              />
            </a>
          </Link>
        </ShortcutBox>
      </AdditionalContent>
    </FeedContentDiv>
  );
};

SearchHospitalPC.displayName = 'SearchHospitalPC';

export default React.memo(SearchHospitalPC);

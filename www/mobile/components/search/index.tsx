import * as React from 'react';
import styled from 'styled-components';
import SearchApi from '../../src/apis/SearchApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import Loading from '../common/Loading';
import SearchItem from './SearchItem';
import SearchSection from './SearchSection';
import {SearchMoaItem, MoaListDiv} from './SearchMoaMobile';
import HospitalItem from '../hospital/HospitalItem';
import {SearchDictItem, DictListUl} from './SearchDictMobile';
import FollowUser from '../user/FollowUser';
import {StyledMeetup2} from './SearchMeetup';
import {numberWithCommas} from '../../src/lib/numbers';
import SearchTab from './SearchTab';
import SearchBanner from './SearchBanner';
import {$BORDER_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import Pagination from '../UI/Pagination';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import {ISearchProps} from '../../src/@types/search';
import SearchNoContentText from './SearchNoContent';
import {useDispatch} from 'react-redux';
import {followUser} from '../../src/reducers/orm/user/follow/thunks';

interface IComponentPrpos {
  data: any[],
  count: number,
  query: string
}


export const SearchTopWrapperDiv = styled.div`
  position: relative;
  border-bottom: 1px solid ${$BORDER_COLOR};
  margin-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 8px;
    background-color: #ecedef;
  }

  .count {
    position: relative;
    max-width: 680px;
    margin: 0 auto;
    padding: 10px 0 12px;

    @media screen and (max-width: 680px) {
      padding: 10px 15px 12px;
    }

    > p {
      ${fontStyleMixin({
        size: 11,
        weight: 'bold',
      })};

      span {
        ${fontStyleMixin({
          color: $POINT_BLUE,
          weight: 'bold',
        })};
      }
    }
  }  
`;

export const FeedNoContentText = styled.p`
  padding: 55px 0 200px;
  box-sizing: border-box;
  text-align: center;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY,
  })}

  img {
    display: block;
    margin: auto;
    width: 25px;
    padding-bottom: 8px;
  }
`;

export const StyledPagination = styled(Pagination)`
  margin: 0 auto;
`;

export const SearchContentDiv = styled.div`
  > div:not(${SearchTopWrapperDiv}) {
    max-width: 680px;
    margin: 0 auto;
  }
`;

export const SearchTitle = styled.h3`
  padding: 15px 0;
  line-height: 23px;
  ${fontStyleMixin({
    size: 16,
    weight:'bold'
  })};
  border-bottom: 1px solid ${$BORDER_COLOR};

  @media screen and (max-width: 680px) {
    padding: 15px;
  }
`;

const StyledFeedWrapper = styled.div`
  padding-bottom: 50px;
  // border-top: 8px solid #ecedef;
  
  @media screen and (max-width: 680px) {
    padding-bottom: 0;
  }

  > div {
    max-width: 680px;
    margin: 0 auto;

    .content {
      > ul > li:last-child {
        border-bottom: 0;
      }
    }
  }

  ${MoaListDiv} > ul li {
    border: 0;
  }

  .hospital li:last-child a {
    border: 0;
  }

  ${DictListUl} li:last-child a {
    border: 0;
  }
`;

const API_RESPONSE_DEFAULT_FIELD = {
  results: [],
  count: 0,
}

const COMPONENT_DEFAULT_FIELD = {
  title: '',
  results: 0,
  count: '',
  component: () => {}
}

const sumArr = (arr: number[]):number => {
  return arr.reduce((accumulator, currentValue) => {
    if(typeof currentValue === 'number') return accumulator + currentValue;
    else return accumulator + (Number(currentValue) || 0);
  });
}

const _SearchFeed: React.FC<IComponentPrpos> = ({data, query}) => (
  <ul>
    {data.map(({id, ...props}) => (
      <Link
        key={id}
        href="/story/[id]"
        as={`/story/${id}`}
      >
        <a>
          <SearchItem
            key={id}
            highlightKeyword={query}
            {...props}
          />
        </a>
      </Link>
    ))}
  </ul>
);

const _SearchHospital: React.FC<IComponentPrpos> = ({data, query}) => (
  <ul>
    {data.map((props, idx) => (
      <li key={idx}>
        <HospitalItem 
          highlightKeyword={query}
          {...props} 
        />
      </li>
    ))}
  </ul>
);

const _SearchMoa: React.FC<IComponentPrpos> = ({data, count, query}) => (
  <MoaListDiv>
    <ul>
      {data.map((props, idx) => (
        <li key={idx}>
          <SearchMoaItem 
            highlightKeyword={query}
            {...props}
          />
        </li>
      ))}
    </ul>
  </MoaListDiv>
);

const _SearchMeetup: React.FC<IComponentPrpos> = ({data, query}) => (
  <ul className="seminar">
    {data.map((props, idx) => (
      <StyledMeetup2
        key={idx}
        highlightKeyword={query}
        {...props}
      />
    ))}
  </ul>
);

const _SearchWiki: React.FC<IComponentPrpos> = ({data, query}) => (
  <DictListUl>
    {data.map((props, idx) => (
      <li key={idx}>
        <SearchDictItem 
          highlightKeyword={query}
          {...props} 
        />
      </li>
    ))}
  </DictListUl>
);

const _SearchUser: React.FC<IComponentPrpos> = ({data}) => {
  
  const dispatch = useDispatch();

  return (
    <ul>
      {data.map((props) => {
        const {id} = props;
        
        return (
          <FollowUser
            key={id}
            onClick={() => dispatch(followUser(id))}
            {...props}
          />
        )
      })}
    </ul>
  )
};

const SearchFeed = React.memo(_SearchFeed);
const SearchHospital = React.memo(_SearchHospital);
const SearchMoa = React.memo(_SearchMoa);
const SearchMeetup = React.memo(_SearchMeetup);
const SearchWiki = React.memo(_SearchWiki);
const SearchUser = React.memo(_SearchUser);

const SearchMain: React.FC<ISearchProps> = ({query}) => {
  const searchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));
  const [compData, setCompData] = React.useState({
    feed: {
      ...COMPONENT_DEFAULT_FIELD, 
      title: '피드',
      component: SearchFeed
    },
    band: {
      ...COMPONENT_DEFAULT_FIELD, 
      title: 'MOA',
      component: SearchMoa
    },
    hospital: {
      ...COMPONENT_DEFAULT_FIELD, 
      title: '한의원',
      component: SearchHospital
    },
    meetup: {
      ...COMPONENT_DEFAULT_FIELD, 
      title: '세미나/모임',
      component: SearchMeetup
    },
    dict: {
      ...COMPONENT_DEFAULT_FIELD, 
      title: '처방사전',
      component: SearchWiki
    },
    user: {
      ...COMPONENT_DEFAULT_FIELD, 
      title: '회원',
      component: SearchUser
    }
  });

  const [{pending, data: {
    search: {results: searchs},
    story: {count: storyCount},
    meetup: {count: meetupCount},
    user: {count: userCount},
    wiki: {count: wikiCount},
    band: {count: bandCount},
    hospital: {count: hospitalCount}
  }}, setData] = React.useState({
    pending: true,
    data: {
      search: API_RESPONSE_DEFAULT_FIELD,
      story: API_RESPONSE_DEFAULT_FIELD,
      band: API_RESPONSE_DEFAULT_FIELD,
      hospital: API_RESPONSE_DEFAULT_FIELD,
      wiki: API_RESPONSE_DEFAULT_FIELD,
      user: API_RESPONSE_DEFAULT_FIELD,
      meetup: API_RESPONSE_DEFAULT_FIELD,
    }
  });
  
  const [totalCount, setTotalCount] = React.useState(0);
  const countArr = [storyCount, meetupCount, userCount, wikiCount, bandCount, hospitalCount];
  
  React.useEffect(() => {
    setTotalCount(sumArr(countArr));
  }, [countArr]);

  React.useEffect(() => {
    searchApi.integrate(query)
      .then(({data}) => {
        setCompData(curr => ({
          feed: {...curr.feed, ...data.story},
          meetup: {...curr.meetup, ...data.meetup},
          hospital: {...curr.hospital, ...data.hospital},
          band: {...curr.band, ...data.band},
          dict: {...curr.dict, ...data.wiki},
          user: {...curr.user, ...data.user}
        }));

        setData({pending: false, data});
      })
  }, [query]);

  return (
    <>
      <SearchTopWrapperDiv>
        <SearchTab/>
        <div className="count">
          <p>
            <span>{numberWithCommas(totalCount)}건</span>
            의 검색결과
          </p>
        </div>
        {!isEmpty(searchs) && (
          <>
            {searchs.map((searchBanner, index)  => (
              <SearchBanner 
                key={index}
                {...searchBanner}
              />
            ))}
          </>
        )}
      </SearchTopWrapperDiv>
      <StyledFeedWrapper>
        {pending ? (
          <Loading/>
        ) : (
          <div>
            {Object.values(compData).every(({count}) => count === 0) ? (
              <SearchNoContentText/>
            ) : (
              Object.keys(compData).map((name) => {
                const {
                  title,
                  count,
                  results: data,
                  component: Component
                } = compData[name];
              
                return (
                  count ? (
                    <SearchSection
                      title={title}
                      tabName={name}
                    >
                      {Component && (
                        <Component 
                          data={data} 
                          count={count} 
                          query={query}
                        />
                      )}
                    </SearchSection>
                  ) : (
                    null
                  )
                )
              })
            )}
          </div>
        )}
      </StyledFeedWrapper>
    </>
  )
};


SearchMain.displayName = 'SearchMain';

export default React.memo(SearchMain);
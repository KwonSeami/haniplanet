import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../src/constants/env';
import {SearchMoaItem, MoaListUl} from './SearchMoaPC';
import {
  TabBannerDiv,
  LeftFeed, 
  FeedContentDiv,
  StyledHospitalItem,
  StyledMeetup2,
  StyledSearchDictItem,
  StyledSearchUserItem} from './styleCompPC';
import AdditionalContent from '../layout/AdditionalContent';
import SearchItem from './SearchItem';
import SearchSection from './SearchSection';
import SearchRank from './SearchRank';
import SearchApi from '../../src/apis/SearchApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import Loading from '../common/Loading';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import {ISearchProps} from '../../src/@types/search';
import SearchNoContentText from './SearchNoContent';
import {useDispatch} from 'react-redux';
import {followUser} from '../../src/reducers/orm/user/follow/thunks';
import ShopItem from '../shopping/ShopItem';
import styled from 'styled-components';

interface IBannerProps {
  title: string;
  direct_url: string;
  content: string;
}

interface IComponentPrpos {
  data: any[],
  count: number,
  query: string
}

const GoodsUl = styled.ul`
  margin: 0 -10px;
  
  li {
    width: 230px;
  }
`


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

const SERVICES_TITLE_KOR = {
  '함께만드는한의플래닛': 'creating',
  '세마나/모임': 'seminar',
  '모두나와': 'modunawa',
  '처방사전': 'dict',
  '플래닛픽': 'pick',
  '김원장넷': 'professor',
  '커뮤니티': 'comunity',
  'MOA': 'moa',
  '한의원': 'hospital',
}

const _SearchBanner: React.FC<IBannerProps> = ({
  title,
  direct_url,
  content,
}) => {
  return (
    <TabBannerDiv
      service={SERVICES_TITLE_KOR[title.replace(/\s/g, '')]}
    >
      <div>
        <h4>
          {title}
          <Link
            href={direct_url}
            as={direct_url}
          >
            <a>
              서비스 바로가기
              <img 
                src={staticUrl('/static/images/icon/arrow/icon-mini-arrow-blue.png')}
                alt="바로가기"
              />
            </a>
          </Link>
        </h4>
        <p>{content}</p>
      </div>
    </TabBannerDiv>
  )
};

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
        <StyledHospitalItem 
          highlightKeyword={query}
          {...props} 
        />
      </li>
    ))}
  </ul>
);

const _SearchMoa: React.FC<IComponentPrpos> = ({data, count, query}) => (
  <MoaListUl className={cn({moa: count > 0})}>
    {data.map((props, idx) => (
      <li key={idx}>
        <SearchMoaItem 
          highlightKeyword={query}
          {...props}
        />
      </li>
    ))}
  </MoaListUl>
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
  <ul>
    {data.map((props, idx) => (
      <li key={idx}>
        <StyledSearchDictItem 
          highlightKeyword={query}
          {...props} 
        />
      </li>
    ))}
  </ul>
);

const _SearchUser: React.FC<IComponentPrpos> = ({data}) => {

  const dispatch = useDispatch();

  return (
    <ul>
      {data.map((props) => {
        const {id} = props

        return (
          <StyledSearchUserItem
            key={id}
            onFollowUser={() => dispatch(followUser(id))}
            {...props}
          />
        )
      })}
    </ul>
  )
};

const _SearchGoods: React.FC<IComponentPrpos> = ({data, query}) => (
  <GoodsUl>
    {data.map(props => {
      return (
        <ShopItem
          id={props.id}
          title={props.title}
          is_follow={props.is_follow}
          products={props.products}
          images={props.images}
        />
      );
    })}
  </GoodsUl>
);

const SearchBanner = React.memo(_SearchBanner);
const SearchFeed = React.memo(_SearchFeed);
const SearchHospital = React.memo(_SearchHospital);
const SearchMoa = React.memo(_SearchMoa);
const SearchMeetup = React.memo(_SearchMeetup);
const SearchWiki = React.memo(_SearchWiki);
const SearchUser = React.memo(_SearchUser);
const SearchGoods = React.memo(_SearchGoods);

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
    },
    goods: {
      ...COMPONENT_DEFAULT_FIELD,
      title: '마켓',
      component: SearchGoods
    }
  })
  const [{pending, data: {
    search: {results: searchs},
  }}, setApiData] = React.useState({
    pending: true,
    data: {
      search: API_RESPONSE_DEFAULT_FIELD,
      story: API_RESPONSE_DEFAULT_FIELD,
      band: API_RESPONSE_DEFAULT_FIELD,
      hospital: API_RESPONSE_DEFAULT_FIELD,
      wiki: API_RESPONSE_DEFAULT_FIELD,
      user: API_RESPONSE_DEFAULT_FIELD,
      meetup: API_RESPONSE_DEFAULT_FIELD,
      goods: API_RESPONSE_DEFAULT_FIELD,
    }
  });
  
  React.useEffect(() => {
    setApiData(curr => ({...curr, pending: true}));
    searchApi.integrate(query)
      .then(({data}) => {
        setCompData(curr => ({
          feed: {...curr.feed, ...data.story},
          meetup: {...curr.meetup, ...data.meetup},
          hospital: {...curr.hospital, ...data.hospital},
          band: {...curr.band, ...data.band},
          dict: {...curr.dict, ...data.wiki},
          user: {...curr.user, ...data.user},
          goods: {...curr.goods, ...data.goods},
        }));
        setApiData({pending: false, data});
      })
      .catch(() => {
        setApiData(curr => ({...curr, pending: false}));
      })
  }, [query])

  return (
    <>
      {!isEmpty(searchs) && (
        <>
          {searchs.map((searchBanner, index) => (
            <SearchBanner 
              key={index}
              {...searchBanner}
            />
          ))}
        </>
      )}
      <FeedContentDiv className="clearfix">
        <LeftFeed>
          {pending ? (
            <Loading/>
          ) : (
            Object.values(compData).every(({count}) => count === 0) ? (
              <SearchNoContentText/>
            ) : (
              Object.keys(compData).map((name) => {
                const {
                  title,
                  count,
                  result,
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
                          data={data || result}
                          count={count} 
                          query={query}
                        />
                      )}
                    </SearchSection>
                  ) : null
                )
              })
            )
          )}
        </LeftFeed>
        <AdditionalContent>
          <SearchRank
            title="인기 검색어"
            api={() => new SearchApi().rank()}
          />
        </AdditionalContent>
      </FeedContentDiv>
    </>
  )
};


SearchMain.displayName = 'SearchMain';

export default React.memo(SearchMain);
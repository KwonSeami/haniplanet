import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../src/constants/env';
import SearchMoaPC from '../../components/search/SearchMoaPC';
import IntegratedSearchHospitalPC from '../../components/search/SearchHospitalPC';
import SearchDictPC from '../../components/search/SearchDictPC';
import {BannerDiv, TabUl} from '../../components/search/styleCompPC';
import SearchMain from '../../components/search';
import {ISearchParam} from '../../src/@types/search';
import Link from 'next/link';
import {useRouter} from "next/router";
import SearchUser from '../../components/search/SearchUser';
import WaypointHeader from '../../components/layout/header/WaypointHeader';
import SearchMeetup from '../../components/search/SearchMeetup';
import SearchStoryPost from '../../components/search/SearchStoryPost';
import queryString from 'query-string';

const SEARCH_TAB_LIST = [
  {name: '', text: '통합검색'},
  {name: 'feed', text: '피드'},
  {name: 'moa', text: 'MOA'},
  {name: 'hospital', text: '한의원'},
  {name: 'meetup', text: '세미나/모임'},
  {name: 'dict', text: '처방사전'},
  {name: 'user', text: '유저'},
];

type TCallback = (param: ISearchParam) => ISearchParam; 
type TSetUrl = (callback: TCallback) => void;

const SearchListPC: React.FC = () => {
  const router = useRouter();
  const {query: {q: query = '', tab, ...rest}, pathname} = router;

  const currTab = (
    SEARCH_TAB_LIST.filter(({name}) => tab === name)[0] 
    || SEARCH_TAB_LIST[0]
  ).name;
    
  const setURL:TSetUrl = (callback) => {
    const param = callback({
      q: query,
      tab,
      ...rest
    });
    
    router.push(`${pathname}?${queryString.stringify(param)}`);
  };

  return (
    <WaypointHeader>
      <section>
        <BannerDiv>
          <Link href="/">
            <a>
              <img
                src={staticUrl('/static/images/icon/arrow/icon-big-shortcuts.png')}
                alt="메인페이지로 이동"
              />
              Main
            </a>
          </Link>
          <h2>{query}</h2>
        </BannerDiv>
        <TabUl>
          {SEARCH_TAB_LIST.map(({
            text,
            name
          }) => (
            <li className={cn({on: currTab === name})}>
              <Link href={`/search?q=${query}&tab=${name}`}>
                <a>{text}</a>
              </Link>
            </li>
          ))}
        </TabUl>
        <div>
          {(currTab === '' && query.length >= 2) && (
            <SearchMain query={query}/>
          )}
          {(currTab === 'feed' && query.length >= 2) && (
            <SearchStoryPost 
              query={query}
              setURL={setURL}
              {...rest}
            />
          )}

          {(currTab === 'moa' && query.length >= 2) && (
            <SearchMoaPC 
              query={query}
              setURL={setURL}
              {...rest}
            />
          )}

          {(currTab === 'hospital' && query.length >= 2) && (
            <IntegratedSearchHospitalPC 
              query={query}
              setURL={setURL}
              {...rest}
            />
          )}

          {(currTab === 'meetup' && query.length >= 2) && (
            <SearchMeetup 
              query={query}
              setURL={setURL}
              {...rest}
            />
          )}
          {(currTab === 'dict' && query.length >= 2) && (
            <SearchDictPC 
              query={query}
              setURL={setURL}
              {...rest}
            />
          )}
          {currTab === 'user' && (
            <SearchUser
              query={query}
              setURL={setURL}
              {...rest}
            />
          )}
        </div>
      </section>
    </WaypointHeader>
  );
};

export default React.memo(SearchListPC);

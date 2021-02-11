import * as React from 'react';
import {useRouter} from "next/router";
import {useDispatch} from 'react-redux';
import {setLayout} from '../../src/reducers/system/style/styleReducer';
import styled from 'styled-components';

import SearchMain, {IParam} from '../../components/search';
import SearchMoaMobile from '../../components/search/SearchMoaMobile';
import IntegratedSearchHospitalMobile from '../../components/search/SearchHospitalMobile';
import SearchDictMobile from '../../components/search/SearchDictMobile';
import SearchUser from '../../components/search/SearchUser';
import SearchStoryPost from '../../components/search/SearchStoryPost';
import SearchMeetup from '../../components/search/SearchMeetup';
import queryString from 'query-string';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../styles/variables.types';


const NoContentText = styled.p`
  text-align: center;
  border-top: 8px solid #ecedef;
  padding: 92px 0 200px;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY
  })}

  img {
    width: 25px;
    display: block;
    margin: auto auto 8px;
  }
`;

const FeedNoContentText = styled.p`
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

type TCallback = (param: IParam) => IParam; 
type TSetUrl = (callback: TCallback) => void;

const SearchResultMobile: React.FC = React.memo(() => {  
  const router = useRouter();
  const {query: {q: query = '', tab = '', ...rest}, pathname} = router;
  const dispatch = useDispatch();

  const setURL:TSetUrl = (callback) => {
    const param = callback({
      q: query,
      tab,
      ...rest
    });
    
    router.push(`${pathname}?${queryString.stringify(param)}`);
  };

  React.useEffect(() => {
    dispatch(setLayout({
      isSearchActive: true
    }))
  },[]);

  return (
    <section>
      <div>
        {/* 통합검색 */}
        {(tab === '' && query.length >= 2) && (
          <SearchMain 
            query={query}
            {...rest}
          />
        )}

        {/* 피드 */}
        {(tab === 'feed' && query.length >= 2) && (
          <SearchStoryPost
            query={query}
            setURL={setURL}
            {...rest}
          />
        )}

        {/* MOA */}
        {(tab === 'moa' && query.length >= 2) && (
          <SearchMoaMobile 
            query={query}
            setURL={setURL}
            {...rest}
          />
        )}

        {/* 한의원 */}
        {(tab === 'hospital' && query.length >= 2) && (
          <IntegratedSearchHospitalMobile 
            query={query}
            setURL={setURL}
            {...rest}
          />
        )}

        {/* 세미나/모임 */}
        {(tab === 'meetup' && query.length >= 2) && (
          <SearchMeetup 
            query={query}
            setURL={setURL}
            {...rest}
          />
        )}

        {/* 처방사전 */}
        {(tab === 'dict' && query.length >= 2) && (
          <SearchDictMobile 
            query={query}
            setURL={setURL}
            {...rest}
          />
        )}

        {/* 회원 */}
        {(tab === 'user' && query.length >= 2) && (
          <SearchUser 
            query={query}
            setURL={setURL}
            {...rest}
          />
        )}
      </div>
    </section>
  );
});

export default SearchResultMobile;

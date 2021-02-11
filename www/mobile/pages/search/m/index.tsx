import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../../src/constants/env';
import {$WHITE, $FONT_COLOR} from '../../../styles/variables.types';
import SearchBaseInput from '../../../components/inputs/Input/SearchBaseInput';
import AutoComplete, {SwitchBtnUl} from '../../../components/layout/header/AutoComplete';
import {AutocompleteUl} from '../../../components/AutocompleteList';
import NoContentLi from '../../../components/AutocompleteList/NoContentACLi';
import SearchApi from '../../../src/apis/SearchApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import throttle from 'lodash/throttle';
import {useSelector, useDispatch} from 'react-redux';
import {getAutoComplete} from '../../../src/lib/autoComplete';
import {useRouter} from 'next/router';
import {unshiftSearchedThunk} from '../../../src/reducers/orm/user/thunks';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import isEqual from 'lodash/isEqual';
import {RootState} from '../../../src/reducers';

const Section = styled.section`
  margin-top: 1px;
`;

const SearchTopDiv = styled.div`
  position: relative;
  background-color: ${$WHITE};
  
  .back {
    position: absolute;
    width: 46px;
    height: 55px;
    top: 1px;
    left: 0;
    z-index: 1;
   
    img {
      position: absolute;
      left: 15px;
      top: 12px;
      width: 20px;
    }
  }
`;

const StyledSearchBaseInput = styled(SearchBaseInput)`
  position: relative;
  height: 55px;
  padding-left: 15px;
  border-bottom: 1px solid ${$FONT_COLOR};
  box-sizing: border-box;

  .clear-button {
    right: 50px;
    top: 19px;
  }
  input {
    width: 100%;
    height: 55px;
    padding-right: 50px;
    font-size: 16px;
  }
  & > img {
    width: 32px;
    position: absolute;
    right: 10px;
    top: 13px;
  }
`;

const StyledAutoComplete = styled(AutoComplete)`
  width: 100%;
  border: 0;
  box-shadow: 0 5px 4px 0 rgba(0, 0, 0, 0.1);

  ${AutocompleteUl} {
    border: 0;
    max-height: 200px;
    overflow-y: auto;

    li {
      height: 38px;
      padding: 9px 85px 9px 13px;

      & > span {
        font-size: 15px;
      }

      .right-content {
        right: 5px;
        top: 8px;

        span {
          letter-spacing: 0;

          img {
            margin: -3px 0 0 -2px;
            width: 32px;
          }
        }
      }
    }
  }

  ${SwitchBtnUl} {
    text-align: left;
    padding: 15px 10px 19px 1px;
    border-left: 0;
    border-right: 0;

    li {
      padding: 0 2px 0 12px;
      
      div {
        margin: -2px 0 0px 6px;
      }
    }
  }
`;

const StyledNoContentLi = styled(NoContentLi)`
  padding: 78px 0 107px !important;
`;


const SearchListMobile = () => {
  const router = useRouter();
  const {query: {q = ''}} = router;
  const dispatch = useDispatch();

  const [query, setQuery] = React.useState(q as string);
  const [acList, setAcList] = React.useState([]);

  const {access, id, user} = useSelector(
    ({system: {session: {access, id}}, orm}: RootState) => ({
      access,
      id,
      user: pickUserSelector(id)(orm) || {} as any
    }),
    (prev, curr) => isEqual(prev, curr)
  );

  const {isAbleAutoComplete} = id !== undefined
    ? getAutoComplete(id) || {isAbleAutoComplete: false}
    : {isAbleAutoComplete: false};

  const searchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));

  const getRelatedSearch = React.useCallback(q => {
    if (!q) {
      setAcList([]);
      return null;
    }

    searchApi.keyword(q)
      .then(({data: {result}}) => !!result && setAcList(result));
  }, []);

  const throttleGetRelatedSearch = React.useCallback(throttle(getRelatedSearch, 300), [getRelatedSearch]);

  const moveToSearchPage = React.useCallback((value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length >= 2) {
      if (access && user.is_save_search) {
        dispatch(unshiftSearchedThunk(value));
      }
      
      router.push(`/search?q=${value}`);
    } else {
      alert('검색어를 2자 이상 입력해주세요.');
    }
  }, [access, user]);

  return (
    <Section>
      <SearchTopDiv>
        <StyledSearchBaseInput
          placeholder="키워드를 입력해주세요."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = (e.target ? e.target.value : e) as string;
            setQuery(value);

            if (access && isAbleAutoComplete) {
              throttleGetRelatedSearch(value);
            }
          }}
          onReset={() => {
            setQuery('');
            setAcList([]);
          }}
          searchBtn={
            <img
              src={staticUrl('/static/images/icon/icon-search-input.png')}
              alt="통합검색"
              onClick={() => {
                moveToSearchPage(query);
              }}
            />
          }
          autoList={{
            acList: query ? acList || [] : [],
            acComp: StyledAutoComplete,
            onSelect: (value) => {
              setQuery(value);
              moveToSearchPage(value);
            },
            acCompProps: {
              children: (
                <StyledNoContentLi>
                  최근 검색 내역이 없습니다.
                </StyledNoContentLi>
              ),
            },
          }}
        />
      </SearchTopDiv>
    </Section>
  );
};

SearchListMobile.displayName = 'SearchListMobile';
export default React.memo(SearchListMobile);

import React from 'react';
import styled from "styled-components";
import SearchBaseInput from '../inputs/Input/SearchBaseInput';
import {fontStyleMixin, heightMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {$WHITE, $TEXT_GRAY, $POINT_BLUE} from '../../styles/variables.types';
import AutoComplete, {SwitchBtnUl, IRightContentProps} from '../AutoComplete/';
import {staticUrl} from '../../src/constants/env';
import Button from '../inputs/Button';
import SearchApi from '../../src/apis/SearchApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import throttle from 'lodash/throttle';
import {MILLI_SECOND} from '../../src/constants/times';
import {getAutoComplete} from '../../src/lib/autoComplete';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {useRouter} from 'next/router';
import {unshiftSearchedThunk} from '../../src/reducers/orm/user/thunks';
import {toDateFormat} from '../../src/lib/date';

const StyledSearchBaseInput = styled(SearchBaseInput)`
  width: 600px;
  height: 48px;
  padding: 0 80px 0 44px;
  border: 1px solid ${$POINT_BLUE};
  background-color: ${$WHITE};
  box-sizing: border-box;

  .input {
    ${fontStyleMixin({
      size: 16
    })};

    ::placeholder {
      ${fontStyleMixin({
        size: 16,
        color: $TEXT_GRAY
      })};
    }
  }

  .button {
    position: absolute;
    top: 1px;
    right: 0;
  }

  img {
    position: absolute;
    top: calc(50% - 10px);
    left: 20px;
    width: 20px;
  }

  img.clear-button {
    display: none;
  }
`;

const StyledAutoComplete = styled(AutoComplete)`
  position: absolute;
  width: 600px;
  padding: 15px 0 19px;
  border-top: 0;

  > div {
    h2 {
      padding: 0 16px 13px;
    }

    .button {
      top: 14px;
      right: 14px;
      font-size: 12px;
    }
  }

  > ul:first-of-type {
    li {
      ${heightMixin(34)};
      padding: 0 0 0 40px;
      ${fontStyleMixin({
        size: 14
      })};
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/search-history.png'),
        size: '20px',
        position: 'left 15px center'
      })};

      &:last-child {
        margin-bottom: 0;
      }

      .right-content {
        right: 19px;
      }
    }
  }

  ${SwitchBtnUl} {
    padding: 3px 14px 0 10px;
    border-top: none;
  }
`;

const NoSearchList = styled.div`
  text-align: center;
  padding: 13px 0 35px;

  img {
    width: 115px;
  }

  p {
    padding-top: 3px;
    ${fontStyleMixin({
      size: 14,
      color: $TEXT_GRAY,
    })};
  }
`;

const RightContentSpan = styled.span`
  letter-spacing: 0;

  img {
    position: static;
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    margin: -3px 0 0 5px;
  }
`;

const RightContent = React.memo<IRightContentProps>(
  ({last_searched_at}) => (
    <RightContentSpan>
      {toDateFormat(last_searched_at, 'YY.MM.DD')}
      <img
        className="pointer"
        src={staticUrl("/static/images/icon/icon-tag-delete.png")}
        alt="삭제"
      />
    </RightContentSpan>
  )
);

const InteGratedSearchInput = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const integratedSearchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));

  const {access, myId, me} = useSelector(
    ({orm, system: {session: {access, id}}}) => ({
      access,
      myId: id,
      me: pickUserSelector(id)(orm)
    }),
    shallowEqual
  );

  const [query, setQuery] = React.useState('');
  const [acList, setAcList] = React.useState([]);

  const getRelatedSearch = React.useCallback(q => {
    if (!q) {
      setAcList([]);
      return null;
    }

    integratedSearchApi.keyword(q)
      .then(({data: {result}}) => {
        !!result && setAcList(result);
      });
  }, []);

  const throttleGetRelatedSearch = React.useCallback(
    throttle(getRelatedSearch, 500 * MILLI_SECOND),
    [getRelatedSearch],
  );

  const onSearch = React.useCallback((value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length >= 2) {
      if (access && me.is_save_search) {
        dispatch(unshiftSearchedThunk(trimmedValue));
      }
      
      router.push(`/search?q=${value}`);
    } else {
      alert('검색어를 2자 이상 입력해주세요.');
    }
  }, [access, me]);

  const {isAbleAutoComplete} = myId !== undefined
    ? getAutoComplete(myId) || {isAbleAutoComplete: false}
    : {isAbleAutoComplete: false};

  return (
    <StyledSearchBaseInput
      placeholder="어떤 정보가 필요하신가요? 키워드로 입력해보세요."
      value={query}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const value = (e.target ? e.target.value : e) as string;
        setQuery(value);

        if (integratedSearchApi && isAbleAutoComplete) {
          throttleGetRelatedSearch(value);
        }
      }}
      autoList={{
        acList: query ? (acList || []) : [],
        acComp: StyledAutoComplete,
        onSelect: onSearch,
        rightContent: RightContent,
        acCompProps: {
          children: (
            <NoSearchList>
              <img
                src={staticUrl('/static/images/icon/main-search-null.png')}
                alt="통합검색"
              />
              <p>최근 검색 내역이 없습니다.</p>
            </NoSearchList>
          ),
        },
      }}
      searchBtn={
        <>
          <img
            src={staticUrl('/static/images/icon/icon-hospital-search.png')}
            alt="통합검색"
          />
          <Button
            size={{
              width: '80px',
              height: 'calc(100% - 2px)',
            }}
            font={{
              size: '16px',
              weight: '600',
              color: $POINT_BLUE,
            }}
            border={{
              radius: '0',
            }}
            backgroundColor={$WHITE}
            onClick={() => onSearch(query)}
          >
            검색
          </Button>
        </>
      }
    />
  );
};

export default React.memo(InteGratedSearchInput);

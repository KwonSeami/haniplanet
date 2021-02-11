import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import loginRequired from '../../hocs/loginRequired';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$WHITE, $FONT_COLOR} from '../../styles/variables.types';
import Meetup2 from '../../components/meetup/Meetup2';
import {staticUrl, BASE_URL} from '../../src/constants/env';
import {numberWithCommas} from '../../src/lib/numbers';
import SearchInput from '../../components/UI/SearchInput';
import Button from '../../components/inputs/Button';
import {CountSelectWrapper, ListWrapper, MeetupMainSelectBox} from '../../components/meetup/MeetupCommon';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {pushPopup} from '../../src/reducers/popup';
import Alert from '../../components/common/popup/Alert';
import {TitleDiv} from '../../components/common/popup/base/TitlePopup';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {makeFeedKey} from '../../src/lib/feed';
import Router, {useRouter} from 'next/router';
import * as queryString from 'query-string';
import {MEETUP_STATUS_LIST, CATEGORY_TYPE_LIST} from '../../src/constants/meetup';
import {RootState} from '../../src/reducers';
import PaginationFeed from '../../components/Feed/PaginationFeed';
import MeetupPlaceList from '../../components/meetup/main/meetupPlace/MeetupPlaceList';
import {changeFirstPageUrl} from '../../src/lib/meetup';
import userTypeRequired from "../../hocs/userTypeRequired";
import {setLayout, clearLayout} from '../../src/reducers/system/style/styleReducer';
import {MAIN_USER_TYPES} from '../../src/constants/users';

const StoryTopTitle = styled.div`
  border-bottom: 1px solid #eee;
  
  h2 {
    max-width: 680px;
    margin: 0 auto;
    padding: 11px 0 0;
    ${fontStyleMixin({
      weight: 'bold',
      color: $FONT_COLOR,
    })};
  
    @media screen and (max-width: 680px) {
      padding: 11px 15px 0;      
    }

    span {
      display: block;
      padding: 5px 0 11px;
      opacity: 0.8;
      ${fontStyleMixin({
        size: 14,
        color: '#999',
      })};
    }
  }
`;

const MeetupMainWrapper = styled.div`
  .main-title {
    max-width: 680px;
    margin: 0 auto;
    padding: 20px 0 0;

    > ul {
      margin: 0 -3px;

      li {
        display: inline-block;
        vertical-align: middle;
        width: 50%;

        &:first-child button {
          color: ${$WHITE};
          background-color: #499aff;
          border-color: transparent;
        }

        button {
          width: calc(100% - 6px);
          margin: 0 3px;
        }
      }
    }
  }

  .search-input {
    top: 0;
    height: auto;
    padding: 5px 0 0;

    input[type="text"] {
      padding: 12px 0 15px;
    }

    img {
      top: 17px;
    }
  }

  .no-content {
    max-width: 680px;
    margin: 8px auto 50px;
    padding: 68px 0 71px;

    @media screen and (max-width: 680px) {
      margin-bottom: 0;
    }
  }
  
  @media screen and (max-width: 680px) {
    .main-title {
      padding: 20px 15px 0;
    }
  }
`;

const StyledButton = styled(Button)`
  display: inline-block;
  height: 45px;
  background-color: ${$FONT_COLOR};
  border-radius: 7px;
  ${fontStyleMixin({
    size: 14, 
    weight: 'bold',
    color: $WHITE
  })};

  img {
    width: 12px;
    display: inline-block;
    vertical-align: middle;
    margin: -4px 4px 0 0;
  }
`;

const StyleAlert = styled(Alert)`
  .modal-body {
    min-width: 250px; 
  }
  
  ${TitleDiv} {
    padding: 0;
    border: 0;
  }

  .popup-child {
    font-size: 17px;
    line-height: 28px;
    text-align: center;
    padding: 65px 0 16px;
  }

  .button {
    margin-bottom: 30px;
  }
`;

const Meetup = () => {
  // Router
  const {asPath, query} = useRouter();
  const {q = '', page = 1, place = '', category = '', meetup_status = ''} = query;

  // State
  const [value, setValue] = React.useState(q || '');
  const fetchURI = React.useMemo(() => `${BASE_URL}/meetup/?${
    queryString.stringify({q, page, place, category, meetup_status})
  }`, [query]);

  // Redux
  const dispatch = useDispatch();
  const {user: {id: myId}, feedCount} = useSelector(
    ({feed, orm, system: {session: {id, access}}}: RootState) => ({
      access,
      user: pickUserSelector(id)(orm) || {} as any,
      feedCount: (feed[makeFeedKey(asPath)] || {} as any).count || 0,
    }),
    shallowEqual,
  );

  const onChangeSearchValue = React.useCallback((({target: {value}}) => {
    setValue(value);
  }), []);

  const showWriteMeetupAlert = React.useCallback(() => {
    dispatch(pushPopup(({id, closePop}) => (
      <StyleAlert
        id={id}
        closePop={closePop}
      >
        세미나/모임 개설은 <br />
        PC에서만 가능합니다.
      </StyleAlert>
    )))
  }, []);

  const changeQUrl = React.useCallback(() => {
    Router.push(
      {pathname: '/meetup', query: {...query, page: 1, q: value}},
      {pathname: '/meetup', query: {...query, page: 1, q: value}},
      {shallow: true},
    );
  }, [query, value]);

  const changeCategoryUrl = React.useCallback(category => (
    changeFirstPageUrl(query, {category})
  ), [query]);
  const changeMeetupStatueUrl = React.useCallback(meetup_status => (
    changeFirstPageUrl(query, {meetup_status})
  ), [query]);

  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: '세미나/모임'
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  return (
    <MeetupMainWrapper>
      <StoryTopTitle>
        <h2>
          세미나/모임
          <span>나누면 나눌수록 깊어지는 지식의 숲</span>
        </h2>
      </StoryTopTitle>
      <div className="main-title">
        <ul>
          <li>
            <StyledButton onClick={showWriteMeetupAlert}>
              <img
                src={staticUrl('/static/images/icon/icon-meetup-plus.png')}
                alt="개설하기"
              />
              개설하기
            </StyledButton>
          </li>
          <li>
            <Link
              href={{pathname: '/user/[id]/meetup', query: {page_type: 'created'}}}
              as={{pathname: `/user/${myId}/meetup`, query: {page_type: 'created'}}}
            >
              <a>
                <StyledButton>
                  <img
                    src={staticUrl('/static/images/icon/icon-meetup-me.png')}
                    alt="나의 세미나/모임"
                  />
                  나의 세미나/모임
                </StyledButton>
              </a>
            </Link>
          </li>
        </ul>
        <SearchInput
          placeholder="세미나/모임 내 상세 검색"
          value={value}
          onChange={onChangeSearchValue}
          onSearch={changeQUrl}
        />
      </div>
      <CountSelectWrapper className="clearfix meetup-main">
        <p className="list-count">
          <span>{`${numberWithCommas(feedCount)}건`}</span>의 세미나/모임
        </p>
        <MeetupPlaceList query={query} />
        <div className="select-wrapper">
          <MeetupMainSelectBox
            option={MEETUP_STATUS_LIST}
            value={meetup_status as string}
            placeholder={!meetup_status ? '모집상태' : ''}
            onChange={changeMeetupStatueUrl}
          />
          <MeetupMainSelectBox
            option={CATEGORY_TYPE_LIST}
            value={category as string}
            placeholder={!category ? '카테고리' : ''}
            onChange={changeCategoryUrl}
          />
        </div>
      </CountSelectWrapper>
      <ListWrapper>
        <PaginationFeed
          className="pagination-feed"
          component={Meetup2}
          highlightKeyword={q}
          fetchURI={fetchURI}
        />
      </ListWrapper>
    </MeetupMainWrapper>
  )
};

export default loginRequired(
  userTypeRequired(
    React.memo(Meetup),
    MAIN_USER_TYPES
  )
);

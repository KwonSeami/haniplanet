// 작업자 : 임용빈
import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import Link from 'next/link';
import {ThemeProvider} from 'styled-components';
import HeaderNavPC from './headerNav/HeaderNavPC';
import theme from './theme';
import {
  FakeHeight,
  IconImg,
  RightMenuUl,
  StyledAutoComplete,
  StyledHeader,
  StyledNoContentLi,
  StyledSearchBaseInput,
  ButtonTextA,
  InputOnButton,
  StyledMainHeader,
} from './styleCompPC';
import {RootState} from '../../../src/reducers';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import throttle from 'lodash/throttle';
import SearchApi from '../../../src/apis/SearchApi';
import {getAutoComplete} from '../../../src/lib/autoComplete';
import queryString from 'query-string';
import AlarmList from './AlarmList';
import Avatar from '../../AvatarDynamic';
import {useRouter, withRouter} from 'next/router';
import {unshiftSearchedThunk} from '../../../src/reducers/orm/user/thunks';
import {clearPopup} from '../../../src/reducers/popup';
import {staticUrl} from '../../../src/constants/env';
import IntegratedSearchInput from '../../mainContent/IntegratedSearchInput';
import SearchRank from '../../mainContent/SearchRank';
import MainHeaderNav from './headerNav/MainHeaderNav';
import {Waypoint} from 'react-waypoint';

const Header = React.memo<any>(() => {
  const dispatch = useDispatch();

  const router = useRouter();
  const {pathname, asPath, query: _search} = router;

  const [query, setQuery] = React.useState('');
  const [acList, setAcList] = React.useState([]);
  const [isSearchInputActive, setIsSearchInputActive] = React.useState(false);
  const [isNavPositionFixed, setIsNavPositionFixed] = React.useState(false);

  const integratedSearchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));

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
    throttle(getRelatedSearch, 300),
    [getRelatedSearch],
  );

  const {
    system: {session: {access, id}, style: {header: {layout}}},
    user,
    popup,
    main,
  } = useSelector(
    ({system, orm, popup, main}: RootState) => ({
      system: system || {} as any,
      user: pickUserSelector(system.session.id)(orm) || {} as any,
      popup,
      main
    }),
    shallowEqual,
  );

  const {background, themetype, fakeHeight, position} = layout;
  
  const {isAbleAutoComplete} = id !== undefined
    ? getAutoComplete(id) || {isAbleAutoComplete: false}
    : {isAbleAutoComplete: false};

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
  }, [access, user.is_save_search]);

  React.useEffect(() => {
    const {query: searchedQuery} = queryString.parse(_search);
    const pathname = asPath.split('?')[0];

    if (asPath === '/search/') {
      if (!!searchedQuery && (query !== searchedQuery)) {
        setQuery(searchedQuery);
      }
    }

    if (pathname !== '/search') {
      setQuery('');
    }
  }, [_search, asPath]);

  const isMainPage = pathname === '/';

  const {
    searchRanks,
  } = main;

  return (
    <ThemeProvider theme={theme}>
      <>
        {isMainPage ? (
          <StyledMainHeader>
            <Waypoint
              onEnter={() => setIsNavPositionFixed(false)}
              onLeave={() => setIsNavPositionFixed(true)}
            >
              <div className="header-top-wrapper">
                <h1>
                  <Link href="/">
                    <a
                      onClick={e => {
                        if (asPath === '/' && !isEmpty(popup)) {
                          e.preventDefault();
                          dispatch(clearPopup());
                        }
                      }}
                    >
                      <img //width: 204px
                        src={staticUrl('/static/images/logo/logo.png')}
                        alt="한의플래닛"
                      />
                    </a>
                  </Link>
                </h1>
                <div className="right-menu">
                  <div className="search-wrapper">
                    <IntegratedSearchInput/>
                    <SearchRank ranks={searchRanks}/>
                  </div>
                  <RightMenuUl>
                    {!!access ? (
                      <>
                        <li>
                          <Link href="/shopping/cart">
                            <a>
                              <IconImg
                                src={theme.cartIcon[themetype]}
                                alt="장바구니"
                              />
                            </a>
                          </Link>
                        </li>
                        <li>
                          <AlarmList theme="black"/>
                        </li>
                        <li>
                          <Avatar
                            id={id}
                            userExposeType="real"
                            src={staticUrl(user?.avatar || '/static/images/banner/img-default-user.png')}
                            size={40}
                          />
                          <Link
                            href="/logout"
                            as="/logout"
                          >
                            <ButtonTextA themetype="black">
                              로그아웃
                            </ButtonTextA>
                          </Link>
                        </li>
                      </>
                    ) : (
                      <li>
                        <Link
                          href="/login"
                          as={`/login?next=${asPath}`}
                        >
                          <ButtonTextA
                            className="login-btn"
                            themetype="black"
                          >
                            로그인
                          </ButtonTextA>
                        </Link>
                        <Link href="/signup">
                          <ButtonTextA themetype="black">
                            회원가입
                          </ButtonTextA>
                        </Link>
                      </li>
                    )}
                  </RightMenuUl>
                </div>
              </div>
            </Waypoint>
            <MainHeaderNav isPositionFixed={isNavPositionFixed}/>
          </StyledMainHeader>
        ) : (
          <>
            {fakeHeight && (
              <FakeHeight/>
            )}
            <StyledHeader
              themetype={themetype}
              background={background}
              position={position}
              className="clearfix"
            >
              <h1>
                <Link href="/">
                  <a
                    onClick={e => {
                      if (asPath === '/' && !isEmpty(popup)) {
                        e.preventDefault();
                        dispatch(clearPopup());
                      }
                    }}
                  >
                    <img
                      src={theme.haniLogo[themetype]}
                      alt="한의플래닛"
                    />
                  </a>
                </Link>
              </h1>

              <div className="right-menu">
                {isSearchInputActive ? (
                  <StyledSearchBaseInput
                    themetype={themetype}
                    placeholder="키워드를 입력해주세요."
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = (e.target ? e.target.value : e) as string;
                      setQuery(value);

                      if (integratedSearchApi && isAbleAutoComplete) {
                        throttleGetRelatedSearch(value);
                      }
                    }}
                    onReset={() => {
                      setQuery('');
                      setAcList([]);
                    }}
                    searchBtn={
                      <img
                        src={theme.searchIcon[themetype]}
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
                          <StyledNoContentLi style={{paddingRight: '0'}}>
                            최근 검색 내역이 없습니다.
                          </StyledNoContentLi>
                        ),
                      },
                    }}
                  />
                ) : (
                  <InputOnButton
                    size={{
                      width: '46px',
                      height: '46px',
                    }}
                    border={{
                      width: '0',
                      radius: '0',
                    }}
                    onClick={() => setIsSearchInputActive(true)}
                  >
                    <img
                      src={theme.searchIcon[themetype]}
                      alt="검색창 활성버튼"
                    />
                  </InputOnButton>
                )}

                <RightMenuUl>
                  <li>
                    <Link href="/shopping/cart">
                      <a>
                        <IconImg
                          src={theme.cartIcon[themetype]}
                          alt="장바구니"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/guide">
                      <a>
                        <IconImg
                          src={theme.helpIcon[themetype]}
                          alt="공지사항"
                        />
                        <span className="help-icon">공지사항</span>
                      </a>
                    </Link>
                  </li>
                  {!!access ? (
                    <>
                      <li>
                        <AlarmList theme={themetype}/>
                      </li>
                      <li>
                        <Avatar
                          id={id}
                          userExposeType="real"
                          src={user.avatar}
                          size={40}
                          cssText={`
                            display: inline-block;
                            margin: -2px 9px 0 2px;
                          `}
                        />
                        <Link
                          href="/logout"
                          as="/logout"
                        >
                          <ButtonTextA themetype={themetype}>
                            로그아웃
                          </ButtonTextA>
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link
                        href="/login"
                        as={`/login?next=${asPath}`}
                      >
                        <ButtonTextA
                          className="login-btn"
                          themetype={themetype}
                        >
                          로그인
                        </ButtonTextA>
                      </Link>
                      <Link
                        href="/signup"
                        // as={}
                      >
                        <ButtonTextA themetype={themetype}>
                          회원가입
                        </ButtonTextA>
                      </Link>
                    </li>
                  )}
                </RightMenuUl>
              </div>

              <HeaderNavPC themetype={themetype}/>
            </StyledHeader>
          </>
        )}
      </>
    </ThemeProvider>
  );
});

Header.displayName = 'Header';
export default withRouter(Header);

// 작업자 : 임용빈
import React from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import HeaderNavMobile from './headerNav/HeaderNavMobile';
import cn from 'classnames';
import {RootState} from '../../../src/reducers';
import {useRouter} from 'next/router';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE, $GRAY} from '../../../styles/variables.types';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {staticUrl} from '../../../src/constants/env';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import {clearPopup} from '../../../src/reducers/popup';
import {disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';
import {HEADER_HEIGHT} from "../../../styles/base.types";
import SearchListMobile from '../../../pages/search/m';

const StyledMainHeader = styled.header<{background: string;}>`
  position: fixed;
  width: 100%;
  height: 55px;
  top: 0;
  left: 0;
  z-index: 10000;
  box-sizing: border-box;
  background-color: ${({background}) => background};

  h1 {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    padding-top: 17px;
    text-align: center;

    span {
      position: absolute;
      left: 19px;
      top: 12px;
      width: 135px;
    }
  }
`;

const StyledMobileHeader = styled.header`
  position: fixed;
  width: 100%;
  height: 55px;
  top: 0;
  left: 0;
  z-index: 10000;
  border-bottom: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  background-color: ${$WHITE};

  h1 {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    padding-top: 17px;

    span {
      position: absolute;
      left: 0;
      top: 17px;
      width: 57px;
      text-align: center;

      img {
        width: 21px;
      }
    }

    p {
      padding-left: 46px;
      ${fontStyleMixin({
        size: 16,
        weight: 'bold',
      })};
    }

    &.prev {
      text-align: center;
      ${fontStyleMixin({
        size: 18,
        weight: '600',
      })};

      span {
        top: 13px;
        width: 50px;

        &::after {
          display: none;
        }
      }
    }
  }

  &.new-window {
    h1 {
      img {
        width: 30px;
      }
    }  
  }
`;

const RightDiv = styled.div`
  position: absolute;
  right: 10px;
  top: 13px;
`;

const Li = styled.li`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  padding-left: 8px;

  &.alarm {
    padding-left: 4px;
  }

  &.login {
    margin-top: -2px;
    
    span {
      ${fontStyleMixin({
        size: 14,
        weight: 'bold',
        color: $WHITE
      })};
    }
  }

  &.signup {
    margin: -2px -3px 0 11px;
    padding-left: 10px;

    &::before {
      content: '';
      position: absolute;
      top: 5px;
      left: 0;
      width: 1px;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.3);
    }

    span {
      ${fontStyleMixin({
        size: 14,
        weight: 'bold',
        color: $WHITE
      })};
    }
  }

  &.login-after-scroll span{
    position: relative;
    color: ${$POINT_BLUE};

    &::after {
      content: '';
      position: absolute;
      right: -10px;
      top: 6px;
      width: 1px;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  &.signup-after-scroll {
    &::before {
      background-color: ${$BORDER_COLOR};
    }
    
    span {
      color: ${$GRAY};
    }
  }

  &:last-child {
    padding-left: 10px;
  }
`;

const IconImg = styled.img`
  width: 30px;
  display: block;
`;

const Label = styled.span`
  position: absolute;
  right: -8px;
  top: 4px;
  display: block;
  width: 25px;
  border-radius: 10px;
  background-color: ${$POINT_BLUE};
  text-align: center;
  ${fontStyleMixin({
    size: 9,
    weight: '600',
    family: 'Montserrat',
    color: $WHITE,
  })};
  ${heightMixin(15)};
`;

const FakeHeight = styled.div`
  height: ${HEADER_HEIGHT}px;
`;

const MAX_HEADER_DETAIL_LENGTH = 10;

const HeaderMobile = () => {
  const appRootElement = React.useRef(null);

  // Router
  const router = useRouter();
  const {pathname} = router;

  // Redux
  const dispatch = useDispatch();

  const {
    system: {session: {access, id}, style: {header: {layout}}},
    user: {alarm_count},
    popup
  } = useSelector(({system, orm, popup}: RootState) => ({
    user: pickUserSelector(system.session.id)(orm) || {} as any,
    system: system || {} as any,
    popup
  }));

  // State
  const [menuOn, setMenuOn] = React.useState(false);
  const {
    headerDetail = '',
    isSearchActive,
    isHeaderTitle,
    background,
    fakeHeight
  } = layout;

  // Life Cycle
  React.useEffect(() => setMenuOn(false), [pathname]);

  React.useEffect(() => {
    appRootElement.current = document.getElementById('appRoot');

    return () => clearAllBodyScrollLocks();
  }, []);

  React.useEffect(() => {
    if (menuOn) {
      disableBodyScroll(appRootElement.current);
    } else {
      enableBodyScroll(appRootElement.current);
    }
  }, [menuOn]);

  // Variables
  const isMainPage = pathname === '/';
  const isSearchPage = pathname === '/search/m';

  const headerDetailText = headerDetail.length <= MAX_HEADER_DETAIL_LENGTH
    ? headerDetail
    : `${headerDetail.substr(0, MAX_HEADER_DETAIL_LENGTH)}...`;

  return (
    <>
      {(isSearchActive && !isSearchPage) && (
        <FakeHeight/>
      )}
      {isMainPage ? (
        <StyledMainHeader background={background}>
          <h1>
            <span
              className="pointer"
              onClick={() => router.push('/')}
            >
              <img
                src={staticUrl(fakeHeight
                  ? '/static/images/logo/full-logo.png'
                  : '/static/images/logo/img-logo3.png'
                )}
                alt="한의플래닛"
              />
            </span>
          </h1>
          <RightDiv>
            <ul>
              {!headerDetail && (
                !!access ? (
                  <>
                    <Li className="dict">
                      <Link href="/wiki" as="/wiki">
                        <a>
                          <IconImg
                            src={staticUrl(fakeHeight
                              ? '/static/images/icon/dict-header.png'
                              : '/static/images/icon/dict-header-white.png'
                            )}
                            alt="처방사전"
                          />
                        </a>
                      </Link>
                    </Li>
                    <Li className="search">
                      <Link href="/search/m">
                        <a>
                          <IconImg
                            src={staticUrl(fakeHeight
                              ? '/static/images/icon/icon-search.png'
                              : '/static/images/icon/icon-search-white.png'
                            )}
                            alt="검색"
                          />
                        </a>
                      </Link>
                    </Li>
                    <Li className="alarm">
                      <Link href="/alarm">
                        <a>
                          <IconImg
                            src={staticUrl(fakeHeight
                              ? '/static/images/icon/icon-notice.png'
                              : '/static/images/icon/icon-notice-white.png'
                            )}
                            alt="알림"
                          />
                          {!!alarm_count && (
                            <Label>{alarm_count}</Label>
                          )}
                        </a>
                      </Link>
                    </Li>
                  </>
                ) : (
                  <>
                    <Li className={cn('login', {
                      'login-after-scroll': fakeHeight
                    })}>
                      <Link href="/login">
                        <a>
                          <span>
                            로그인
                          </span>
                        </a>
                      </Link>
                    </Li>
                    <Li className={cn('signup', {
                      'signup-after-scroll': fakeHeight
                    })}>
                      <Link href="/signup">
                        <a>
                          <span>
                            회원가입
                          </span>
                        </a>
                      </Link>
                    </Li>
                  </>
                )
              )}
              <Li>
                <IconImg
                  src={staticUrl(fakeHeight
                    ? '/static/images/icon/icon-menu.png'
                    : '/static/images/icon/icon-menu-white.png'
                  )}
                  onClick={() => setMenuOn(true)}
                  alt="메뉴"
                  className="pointer"
                />
              </Li>
            </ul>
          </RightDiv>
          {menuOn && (
            <HeaderNavMobile
              onClose={() => setMenuOn(false)}
              access={access}
            />
          )}
        </StyledMainHeader>
      ) : (
        <>
          <FakeHeight/>
          <StyledMobileHeader className="clearfix">
            <h1 className={cn({prev: isHeaderTitle})}>
              <span
                className="pointer"
                onClick={() => isHeaderTitle
                  ? !isEmpty(popup)
                    ? dispatch(clearPopup())
                    : router.back()
                  : router.push('/')
                }
              >
                <img
                  src={staticUrl(isHeaderTitle
                    ? '/static/images/icon/arrow/icon-prev.png'
                    : '/static/images/logo/logo.png')
                  }
                  alt="한의플래닛"
                />
              </span>
              {isHeaderTitle 
                ? headerDetailText
                : (
                  <p>
                    {headerDetail}
                  </p>
                )
              }
            </h1>
            <RightDiv>
              <ul>
                {!isHeaderTitle && (
                  <>
                    <Li className="dict">
                      <Link
                        href="/wiki"
                        as="/wiki"
                      >
                        <a>
                          <IconImg
                            src={staticUrl('/static/images/icon/dict-header.png')}
                            alt="검색"
                          />
                        </a>
                      </Link>
                    </Li>
                    <Li className="search">
                      <Link href="/search/m">
                        <a>
                          <IconImg
                            src={staticUrl('/static/images/icon/icon-search.png')}
                            alt="검색"
                          />    
                        </a>
                      </Link>
                    </Li>
                    {!!access && (
                      <Li className="alarm">
                        <Link href="/alarm">
                          <a>
                            <IconImg
                              src={staticUrl('/static/images/icon/icon-notice.png')}
                              alt="알림"
                            />
                            {!!alarm_count && (
                              <Label>{alarm_count}</Label>
                            )}
                          </a>
                        </Link>
                      </Li>
                    )}
                  </>
                )}
                <Li>
                  <IconImg
                    src={staticUrl('/static/images/icon/icon-menu.png')}
                    onClick={() => setMenuOn(true)}
                    alt="메뉴"
                    className="pointer"
                  />
                </Li>
              </ul>
            </RightDiv>
            {menuOn && (
              <HeaderNavMobile
                onClose={() => setMenuOn(false)}
                access={access}
              />
            )}
            {(isSearchActive && !isSearchPage) && (
              <SearchListMobile />
            )}
          </StyledMobileHeader>
        </>
      )}
    </>
  );
};

HeaderMobile.displayName = 'HeaderMobile';
export default React.memo(HeaderMobile);

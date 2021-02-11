// 작업자: 임용빈
import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import cn from 'classnames';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {fontStyleMixin, heightMixin, backgroundImgMixin} from '../../../../styles/mixins.styles';
import {
  $FONT_COLOR,
  $POINT_BLUE,
  $WHITE,
  $TEXT_GRAY,
  $GRAY
} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';
import {fetchNavsThunk} from '../../../../src/reducers/nav';
import Label from "../../../UI/tag/Label";
import {RootState} from '../../../../src/reducers';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import isEqual from 'lodash/isEqual';
import {USER_TYPE_TO_KOR} from '../../../../src/constants/users';
import A from "../../../UI/A";
import {numberWithCommas} from '../../../../src/lib/numbers';
import Avatar from '../../../../components/Avatar';
import DoctalkBadge from '../../../doctalk/DoctalkBadge';
import HEADER_MENUS from './headerMenus';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  z-index: 1;
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 13px;

  img {
    width: 30px;
  }
`;

const NavBox = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 360px;
  height: 100%;
  box-sizing: border-box;
  background-color: ${$WHITE};

  .nav-top {
    position: relative;
    padding: 30px 15px 10px;

    a {
      > img {
        position: absolute;
        top: 30px;
        left: 20px;
      }
      
      > div.profile-wrapper {
        margin: -5px 0 0 80px;
        padding-bottom: 10px;
      }

      h2 {
        display: inline-block;
        vertical-align: middle;
        max-width: calc(100% - 108px);
        line-height: 38px;
        white-space: nowrap;
        text-overflow: ellipsis;
        box-sizing: border-box;
        overflow: hidden;
        ${fontStyleMixin({
          size: 24,
          weight: '300'
        })}
      }
    }

    .avatar {
      > div {
        top: 30px;
        left: 20px;
        position: absolute;
        vertical-align: middle;
        margin-left: 4px;
      }
      
      &.anonymous {
        display: inline-block;
        
        > div {
          position: static;
          
          img {
            position: relative;
          }
        }
      }
    }

    .login-id {
      display: block;
      margin: -4px 0 0;
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY
      })};

      span {
        color: ${$GRAY};
      }
    }

    .point {
      display: block;
      ${fontStyleMixin({
        size: 18,
        weight: '300',
        color: $POINT_BLUE,
        family: 'Montserrat'
      })}

      img {
        display: inline-block;
        vertical-align: middle;
        width: 15px;
        margin: -3px -2px 0 0;
      }
    }

    .doctalk-badge {
      text-align: center;
      margin: 0 2px 0 2px;
    }

    &.non-member-nav {
      padding-top: 55px;

      h2 {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        ${fontStyleMixin({
          size: 19,
          color: $TEXT_GRAY
        })}
      }
    }
  }

  .shortcuts {
    display: block;
    margin-top: -1px;
    padding: 0 5px 8px 0;
    text-align: right;
    ${fontStyleMixin({
      size: 12,
      weight: '600'
    })}
  
    img {
      width: 12px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 0 0 -2px;
    }
  }
  
  .shortcuts-login {
    display: block;
    width: 100%;
    margin: 29px auto auto;
    text-align: center;
    border-radius: 8px;
    ${heightMixin(52)}
    ${fontStyleMixin({
      size: 16,
      color: $WHITE
    })}
    background-color: ${$POINT_BLUE};

    &.shortcuts-logout {
      margin-top: 2px;
      background-color: ${$FONT_COLOR};
    }
  }

  .nav-body {
    background-color: ${$WHITE};
    border-top: 8px solid #f2f3f7;

    h2 {
      a {
        display: block;
        ${heightMixin(60)};
        position: relative;
        padding: 0 17px;
        box-sizing: border-box;
        ${fontStyleMixin({
          size: 17
        })};
        
        img {
          position: absolute;
          top: 16px;
          right: 19px;
          width: 28px;
        }
      }

      &:last-of-type {
        background-color: #2c2742;

        a {
          padding-left: 54px;
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/icon-live.png'),
            size: '30px',
            position: '6%'
          })};
          ${fontStyleMixin({
            color: $WHITE
          })};
        }
      }
    }
  }

  .menu {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    
    li {
      float:left;
      width: 33.333%;
      height: 97px;
      margin-bottom: -1px;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      
      &:nth-child(3n) {
        border-right: 0;
      }
      
      &.on a {
        color: ${$POINT_BLUE};
        text-decoration: underline;
      }

      a {
        display: block;
        width: 100%;
        height: 100%;
        padding-top: 15px;
        text-align: center;
        box-sizing: border-box;
        ${fontStyleMixin({
          size: 12,
          color: $GRAY
        })}
        
        img {
          display: block;
          margin: auto;
          width: 44px;
          padding-bottom: 1px;
        }
      }
    }
  }
  
  @media screen and (max-width: 680px) {
    width: 100%;
  }
`;

const MenuUserLabel = styled(Label)`
  ${heightMixin(22)}
  margin-left: 2px;
`;

const MenuUserDoctalkLabel = styled.span`
  display: inline-block;
  width: 62px;
  height: 22px;
  line-height: 22px;
  margin-left: 2px;
  border-radius: 10px;
  background-color: #ddf1de;
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;
  ${fontStyleMixin({
    size: 10,
    weight: '600',
    color: '#3faf44'
  })};

  img {
    width: 9px;
    margin: 0 2px -1px 0;
  }
`;

interface IProps {
  onClose: () => void;
  access: HashId;
}

const HeaderNavMobile = React.memo<IProps>(({onClose, access}) => {
  // Redux
  const dispatch = useDispatch();
  const {navMap} = useSelector(({navs}) => ({
    navMap: navs.reduce((prev, {id, name}) => {
      prev[name] = id;
      return prev;
    }, {})
  }),
    shallowEqual
  );

  // Life Cycle
  React.useEffect(() => {
    dispatch(fetchNavsThunk());
  }, []);

  const {
    system: {session: {id}},
    me
  } = useSelector(
    ({system, orm}: RootState) => ({
      me: pickUserSelector(system.session.id)(orm) || {} as any,
      system,
    }),
    (prev, curr) => isEqual(prev, curr),
  );

  const {auth_id, avatar, name, user_type, point, nick_name, is_regular, is_doctalk_doctor} = me;

  return (
    <Nav>
      <NavBox>
        <div className={cn('nav-top', {'non-member-nav': !access})}>
          {!!access ? (
            <>
              <Link href={`/user/${id}`}>
                <a>
                  <Avatar
                    id={id}
                    size={60}
                    src={avatar}
                    userExposeType="real"
                  />
                  <div className="profile-wrapper">
                    <div>
                      <h2>
                        {name}
                      </h2>
                      <MenuUserLabel
                        name={USER_TYPE_TO_KOR[user_type]}
                        color={$FONT_COLOR}
                        borderColor="#999"
                      />
                      <MenuUserLabel
                        name={is_regular ? '정회원' : '준회원'}
                        color={is_regular ? '#78cf8e' : '#cfae78'}
                        borderColor={is_regular ? '#78cf8e' : '#cfae78'}
                      />
                      {is_doctalk_doctor && (
                        <DoctalkBadge
                          className="doctalk-badge"
                          type="short"
                        />
                      )}
                    </div>
                    <p className="login-id">
                      <span>{nick_name}</span>({auth_id})
                    </p>
                    <span className="point">
                      <img
                        src={staticUrl("/static/images/icon/icon-point.png")}
                        alt="현재 나의 별"
                      /> {numberWithCommas(point)}
                    </span>
                  </div>
                  <p className="shortcuts">
                    마이페이지
                    <img
                      src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png')}
                      alt="마이페이지 바로가기"
                    />
                  </p>
                </a>
              </Link>
              <Link
                href="/logout"
                passHref
              >
                <a className="shortcuts-login shortcuts-logout">
                  로그아웃
                </a>
              </Link>
            </>
          ) : (
            <>
              <Avatar
                size={60}
                src={staticUrl('/static/images/icon/icon-login-profile.png')}
                className="anonymous"
              />
              <h2>로그인을 해주세요.</h2>
              <Link
                href="/login"
                passHref
              >
                <a className="shortcuts-login">
                  로그인
                </a>
              </Link>
            </>
          )}
        </div>
        <CloseBtn
          className="pointer"
          onClick={onClose}
        >
          <img
            src={staticUrl('/static/images/icon/icon-close.png')}
            alt="닫기"
          />
        </CloseBtn>
        <div className="nav-body">
          {/* <h2>
            <Link href={`/tag/${navMap['함께 만드는 한의플래닛']}`}>
              <a className="haniplanet-together">
                함께 만드는 한의플래닛
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-round-shortcut.png')}
                  alt="함께 만드는 한의플래닛"
                />
              </a>
            </Link>
          </h2> */}
          {/*<h2>*/}
          {/*  <Link href="/live">*/}
          {/*    <a>*/}
          {/*      <img*/}
          {/*        src={staticUrl('/static/images/icon/arrow/icon-round-shortcut2.png')}*/}
          {/*        alt="실시간 라이브 방송"*/}
          {/*      />*/}
          {/*      실시간 라이브 방송*/}
          {/*    </a>*/}
          {/*  </Link>*/}
          {/*</h2>*/}
          <ul
            className="menu clearfix"
            onClick={onClose}
          >
            {HEADER_MENUS.map(({name, key, href, outerHref, as, icon}) => (!key || navMap[key]) && (
              <li
                key={name}
                className={cn({on: as && location.pathname === as(navMap)})}
              >
                {outerHref ? (
                  <A to={outerHref} newTab>
                    <img src={icon} alt={name}/>
                    {name}
                  </A>
                ) : (
                  <Link href={href(navMap)} as={as(navMap)}>
                    <a>
                      <img src={icon} alt={name}/>
                      {name}
                    </a>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </NavBox>
    </Nav>
  );
});

HeaderNavMobile.displayName = 'HeaderNavMobile';

export default HeaderNavMobile;

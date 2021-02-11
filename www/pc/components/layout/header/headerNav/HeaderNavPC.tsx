import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {$WHITE, $POINT_BLUE, $BORDER_COLOR} from '../../../../styles/variables.types';
import {useRouter} from "next/router";
import {staticUrl} from '../../../../src/constants/env';
import {backgroundImgMixin} from '../../../../styles/mixins.styles';
import classNames from "classnames";
import {fetchNavsThunk} from "../../../../src/reducers/nav";
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import HEADER_MENUS from './headerMenus';
import {RootState} from '../../../../src/reducers';

interface Props {
  themetype?: string;
  on?: boolean;
}

const Nav = styled.nav`
  padding-top: 20px;
`;

const Li = styled.li<Props>`
  position: relative;
  padding-right: 16px;
  display: inline-block;
  vertical-align: middle;
  font-size: 17px;
  font-weight: 600;
  opacity: 0.8;
  transition: opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);

  &:hover {
    opacity: 1;
  }

  ${({themetype, theme}) => themetype && `
    a, a:link, a:visited, a:focus, a:hover, a:active {
      color: ${theme.fontColor[themetype]};
    }
  `};

  &.on {
    opacity: 1;

    & > a {
      position: relative;
      ${({themetype}) => themetype === 'black' && `
        color: ${$POINT_BLUE};
      `}

      &::after {
        content: '';
        position: absolute;
        bottom: -19px;
        left: 0;
        width: 100%;
        height: 1px;
        ${({themetype}) => `background-color: ${themetype === 'black' 
          ? `${$POINT_BLUE}` 
          : `${$WHITE}`
        }`};
      }
    }
  }

  &.beta {
    position: relative;
    padding-right: 42px;

    &::after {
      content: '';
      position: absolute;
      width: 22px;
      height: 11px;
      top: 2px;
      right: 18px;
      ${({themetype}) => {
        const img = themetype === 'white' 
          ? 'icon-nav-beta-white.png' 
          : 'icon-nav-beta.png';
        
        return backgroundImgMixin({
          img: staticUrl(`/static/images/icon/${img}`)
        });
      }};
    }
  }

  a {
    display: inline-block;
    height: 25px;
  }

  > img {
    width: 14px;
    margin: -2px 0 0 2px;
    vertical-align: middle;
  }

  &:hover {
    ul {
      top: 24px;
      opacity: 1;
    }
  }

  //child
  ul {
    position: absolute;
    /* 상위 li 오버시 애니메이션 주기 위해서 */
    top: -1000px; 
    left: -25px;
    padding-top: 11px;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier( 0.25, 0.1, 0.25, 1 );
    li {
      width: 150px;
      height: 40px;
      font-size: 14px;
      border: 1px solid ${$BORDER_COLOR};
      background-color: ${$WHITE};
      box-sizing: border-box;
      transition: all 0.3s;
      & + li {
        margin-top: -2px;
      }
      &:hover {
        background-color: #f9f9f9;
      }
      a {
        display: block;
        padding: 9px 14px;
        color: #999 !important;
        img {
          vertical-align: 0;
          margin-left: 4px;
          width: 22px;
          height: 11px;
        }
      }
    }
  }
`;

const HeaderNavPC = React.memo<Props>(({themetype}) => {
  // Redux
  const {asPath} = useRouter();

  const dispatch = useDispatch();
  const {navMap, navDetail} = useSelector(
    ({navs, system: {style: {header: {navigation: {navDetail}}}}}: RootState) => ({
      navDetail: navDetail || '' as string,
      navMap: navs.reduce((prev, {id, name}) => {
        prev[name] = id;
        return prev;
      }, {})
    }),
    shallowEqual  
  );

  React.useEffect(() => {
    dispatch(fetchNavsThunk());
  }, []);

  return (
    <Nav>
      <ul>
        {HEADER_MENUS.map(({name, href, as, children}) => (
          <Li
            key={name}
            themetype={themetype}
            className={classNames({
              beta: ['김원장넷', '모두나와', '한의원'].includes(name),
              on: typeof window !== 'undefined' && (window.decodeURIComponent(asPath) ===  as(navMap) || navDetail === as(navMap))}
            )}
          >
            {(href && as) ? (
              <Link href={href(navMap)} as={as(navMap)}>
                <a>{name}</a>
              </Link>
            ): (
              <a>{name}</a>
            )}
            {children && children}
            {['플래닛마켓'].includes(name) && (
              <img
                src={staticUrl('/static/images/icon/new-menu.png')}
                alt="새 메뉴"
              />
            )}
          </Li>
        ))}
      </ul>
    </Nav>
  );
});

HeaderNavPC.displayName = 'HeaderNavPC';

export default HeaderNavPC;

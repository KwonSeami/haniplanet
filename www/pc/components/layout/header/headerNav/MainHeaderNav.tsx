import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {$WHITE} from '../../../../styles/variables.types';
import {useRouter} from "next/router";
import {staticUrl} from '../../../../src/constants/env';
import {backgroundImgMixin, heightMixin, fontStyleMixin} from '../../../../styles/mixins.styles';
import classNames from "classnames";
import {fetchNavsThunk} from "../../../../src/reducers/nav";
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import HEADER_MENUS from './headerMenus';

const Nav = styled.nav<Props>`
  ${({isPositionFixed}) => isPositionFixed
    ? `
      position: fixed;
      top: 0;
      z-index: 10;
    `
    : `
      position: absolute;
      bottom: 0;
    `
  };
  left: 0;
  width: 100%;
  min-width: 1125px;
  ${heightMixin(54)};
  background-color: #499aff;

  ul {
    width: 1090px;
    margin: 0 auto;
  }
`;

const Li = styled.li`
  position: relative;
  padding-right: 16px;
  display: inline-block;
  vertical-align: middle;

  a, a:link, a:visited, a:focus, a:hover, a:active {
    position: relative;
    ${fontStyleMixin({
      size: 15,
      weight: 'bold',
      color: $WHITE,
    })};
  }

  .onclass-nav-icon {
    width: 23px;
    vertical-align: middle;
    margin: -4px 1px 0 0;
  }

  .new-nav-icon {
    width: 14px;
    vertical-align: middle;
    margin: -7px 0 0 1px;
  }

  &.beta {
    position: relative;
    padding-right: 35px;

    a::after {
      content: '';
      position: absolute;
      top: 1px;
      right: -23px;
      width: 21px;
      height: 11px;
      ${backgroundImgMixin({
        img: staticUrl(`/static/images/icon/icon-nav-beta-white.png`)
      })};
    }

    &.new a::after {
      right: -40px;
    }
  }

  &:nth-last-child(-n+4) a {
    color: rgba(255, 255, 255, 0.7);
  }

  &:nth-last-child(4) {
    padding-left: 25px;

    &::before {
      content: '';
      position: absolute;
      top: 17px;
      left: 4px;
      width: 1px;
      height: 20px;
      background-color: ${$WHITE};
      opacity: 0.3;
    }
  }
`;

interface Props {
  isPositionFixed: boolean;
}

const NEWS = ['플래닛마켓'];
const ONCLASS = ['온라인강의'];

const MainHeaderNav: React.FC<Props> = ({isPositionFixed}) => {
  const {asPath} = useRouter();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchNavsThunk());
  }, []);

  const {navMap, navDetail} = useSelector(
    ({
      navs,
      system: {
        style: {
          header: {
            navigation: {
              navDetail
            }
          }
        }
      }
    }) => ({
      navDetail: navDetail || '' as string,
      navMap: navs.reduce((prev, {id, name}) => {
        prev[name] = id;
        return prev;
      }, {})
    }),
    shallowEqual  
  );

  return (
    <Nav isPositionFixed={isPositionFixed}>
      <ul>
        {HEADER_MENUS.map(({name, href, as}) => (
          <Li
            key={name}
            className={classNames({
                beta: ['김원장넷', '모두나와', '한의원'].includes(name),
                'new': NEWS.includes(name),
                on: typeof window !== 'undefined' && (window.decodeURIComponent(asPath) ===  as(navMap) || navDetail === as(navMap)
              )},
            )}
          >
            {ONCLASS.includes(name) && (
              <img
                className="onclass-nav-icon"
                src={staticUrl('/static/images/icon/onclass-nav.png')}
                alt="온라인강의"
              />
            )}
            {(href && as) ? (
              <Link href={href(navMap)} as={as(navMap)}>
                <a>{name}</a>
              </Link>
            ): (
              <a>{name}</a>
            )}
            {NEWS.includes(name) && (
              <img
                className="new-nav-icon"
                src={staticUrl('/static/images/icon/new-menu.png')}
                alt="새 메뉴"
              />
            )}
          </Li>
        ))}
      </ul>
    </Nav>
  );
};

MainHeaderNav.displayName = 'MainHeaderNav';

export default React.memo(MainHeaderNav);

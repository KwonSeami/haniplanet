import * as React from 'react';
import Link from 'next/link';
import menus from './menus';
import styled from 'styled-components';
import {$GRAY, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';

const Ul = styled.ul`
  padding: 2px 20px 27px 20px;
  border-bottom: 1px solid ${$GRAY};

  li {
    position: relative;
    display: inline-block;
    padding: 20px 30px 0 13px;
    vertical-align: middle;

    &::before {
      content: '';
      position: absolute;
      top: 26px;
      left: 0;
      width: 1px;
      height: 8px;
      background-color: ${$TEXT_GRAY};
    }
  
    a {
      ${fontStyleMixin({
        size: 13,
        color: $TEXT_GRAY
      })};
    }
  }
`;

const FooterMenu = React.memo(() => (
  <Ul className="footer-menu">
    {menus.map(({name, href}) => (
      <li key={name}>
        <Link href={href}>
          <a>{name}</a>
        </Link>
      </li>
      )
    )}
  </Ul>
));

FooterMenu.displayName = 'FooterMenu';
export default FooterMenu;

import * as React from 'react';
import Link from 'next/link';
import menus from './menus';
import styled from 'styled-components';

const Li = styled.li`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  padding: 8px 20px 0 0;

  a {
    font-size: 13px;
  }
`;

const FooterMenu = React.memo(() => (
  <ul className="footer-menu">
    {menus.map(({name, href}) => (
      <Li key={name}>
        <Link href={href}>
          <a>{name}</a>
        </Link>
      </Li>
      )
    )}
  </ul>
));

FooterMenu.displayName = 'FooterMenu';
export default FooterMenu;

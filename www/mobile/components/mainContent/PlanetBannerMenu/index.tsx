import React from 'react';
import styled from 'styled-components';
import menus from './menus';
import Menu from './Menu';

const Ul = styled.ul`
  padding-right: 10px;
  margin-top: 4px;
  overflow-x: auto;
  white-space: nowrap;
`;

const PlanetBannerMenu = () => (
  <Ul>
    {menus.map((props) => (
      <Menu
        key={props.url}
        {...props}
      />
    ))}
  </Ul>
);

export default React.memo(PlanetBannerMenu);

import * as React from 'react';
import styled from 'styled-components';
import links from './links';
import A from '../../UI/A';

const Li = styled.li`
  padding-right: 4px;
  display: inline-block;
  vertical-align: middle;
  
`;
const Img = styled.img`
  width: 24px;
`;

const FooterLinks = React.memo(() => (
  <ul className="footer-links">
    {links.map(({src, href, alt}) => (
      <Li key={`${src}_${alt}`}>
        <A to={href} newTab>
          <Img
            src={src}
            alt={alt}
          />
        </A>
      </Li>
    ))}
  </ul>
));

export default FooterLinks;
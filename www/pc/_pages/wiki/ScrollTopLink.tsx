import * as React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../styles/variables.types';

const StyledLink = styled.a`
  display: block;
  width: 100%;
  height: 100%;
  ${fontStyleMixin({
    family: 'Montserrat',
    weight: '600',
    size: 12,
    color: $TEXT_GRAY,
  })};
`;

interface Props {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  href: string;
  className?: string;
}

const ScrollTopLink = React.memo<Props>(({
  onClick,
  className,
  children,
  href,
  ...props
}) => (
  <Link
    passHref
    href={href || ''}
    {...props}
  >
    <StyledLink
      className={className}
      onClick={(e) => {
        onClick && e.preventDefault();
        onClick && onClick(e);
      }}
    >
      {children}
    </StyledLink>
  </Link>
));

ScrollTopLink.displayName = 'ScrollTopLink';
export default ScrollTopLink;
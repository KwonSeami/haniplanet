import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';

const Badge = styled.span`
  padding: 3px 8px;
  border: 1px solid #eee;
  border-radius: 2px;
  ${fontStyleMixin({
    size: 12,
    color: '#6dc057'
  })}
`;

interface Props {
  className?: string;
}

const NaverKinBadge: React.FC<Props> = ({className}) => (
  <Badge className={className}>네이버 지식iN</Badge>
);

export default React.memo(NaverKinBadge);

import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {HashId} from '../../../../../packages/types';

const Li = styled.li<{color: string;}>`
  position: relative;
  display: inline-block;
  vertical-align: top;
  padding: 10px 6px 14px;

  &.on {
    span {
      color: ${({color}) => color || '#499aff'};
    }
  }

  &.new {
    padding-right: 11px;

    span::after {
      content: '';
      position: absolute;
      top: 2px;
      right: -6px;
      width: 4px;
      height: 4px;
      border-radius: 100%;
      background-color: ${({color}) => color};
    }
  } 

  span {
    position: relative;
    ${fontStyleMixin({
      size: 15,
      weight: 'bold',
      color: '#999'
    })};
  }
`;

interface Props {
  id: HashId;
  className?: string;
  name: string;
  onClick: (name: string, id: HashId) => void;
  color: string;
}

const CommunityNavigationItem = ({
  className,
  name,
  id,
  onClick,
  color
}: Props) => {
  return (
    <Li
      className={className}
      onClick={() => onClick(name, id)}
      color={color}
    >
      <span>{name}</span>
    </Li>
  );
}

export default React.memo(CommunityNavigationItem);

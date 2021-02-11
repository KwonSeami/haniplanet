import React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR} from '../../../styles/variables.types';

const Li = styled.li<{color: string;}>`
  position: relative;
  display: inline-block;
  margin: 0 16px 0 17px;
  font-size: 16px;
  line-height: 20px;
  border-bottom: 1px solid transparent;

  & ~ li::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -16px;
    transform: translateY(-50%);
    height: 10px;
    border-left: 1px solid ${$BORDER_COLOR};
  }

  &:hover {
    border-bottom: 1px solid ${$FONT_COLOR};
  }

  &.on {
    color: ${({color}) => color};
    border-bottom: 1px solid ${({color}) => color};
  }

  &.new::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -5px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: ${({color}) => color};
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
      {name}
    </Li>
  );
}

export default React.memo(CommunityNavigationItem);

import React from 'react';
import styled, {keyframes} from 'styled-components';
import cn from 'classnames';
import {$POINT_BLUE} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';

const HighlightToRight = keyframes`
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
`;

const Li = styled.li`
  position: relative;
  display: inline-block;
  margin-left: 17px;
  overflow: hidden;
  ${fontStyleMixin({
    size: 20,
    weight: 'bold',
    color: '#999'
  })};

  &:first-child {
    margin-left: 0;
  }

  &.highlighted {
    color: ${$POINT_BLUE};

    &::after {
      content: '';
      position: absolute;
      z-index: -1;
      top: 50%;
      left: 0;
      width: 100%;
      height: 50%;
      transform: translateX(-100%);
      background-color: #edf5ff;
      animation: ${HighlightToRight} 0.3s forwards;
    }
  }
`;

interface Props {
  id: number;
  name: string;
  isHighlighted: boolean;
  onClick: (id: number) => void;
}

const HospitalStoryTag: React.FC<Props> = ({
  id,
  name,
  isHighlighted,
  onClick
}) => {
  return (
    <Li
      className={cn('pointer', {
        highlighted: isHighlighted
      })}
      onClick={() => onClick(id)}
    >
      #{name}
    </Li>
  );
};

export default React.memo(HospitalStoryTag);

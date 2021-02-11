import React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {$WHITE, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';

const Li = styled.li`
  position: relative;
  display: inline-block;
  padding: 7px 12px 8px;
  margin-right: 8px;
  border-radius: 4px;
  background-color: ${$WHITE};
  ${fontStyleMixin({
    size: 14,
    weight: '600',
    color: $TEXT_GRAY,
  })};

  &:last-child {
    margin-right: 0;
  }

  &.highlighted {
    color: ${$WHITE};
    background-color: #499aff;

    &::after {
      content: '';
      position: absolute;
      z-index: -1;
      top: 50%;
      left: 0;
      width: 100%;
      height: 50%;
      background-color: #edf5ff;
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

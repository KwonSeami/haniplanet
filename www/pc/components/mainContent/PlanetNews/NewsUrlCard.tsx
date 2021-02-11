import React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {$WHITE, $GRAY} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import Button from '../../inputs/Button';
import {backgroundImgMixin} from '../../../styles/mixins.styles';

const Li = styled.li`
  position: relative;
  width: 116px;
  margin-left: -1px;
  background-color: ${$WHITE};

  img {
    height: 20px;
    vertical-align: middle;
  }

  &:not(.on):hover {
    z-index: 1;
    border-color: ${$GRAY};
  }

  &.on {
    z-index: 2;
    
    &::after {
      content: '';
      position: absolute;
      top: -5px;
      right: -4px;
      width: 19px;
      height: 20px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/check/check-white-blue_bg.png'),
      })};
    }
  }
`;

interface Props {
  logo: string;
  name: string;
  id: number;
  isSelected: boolean;
  onClick: (id: number) => void;
}

const NewsUrlCard = ({
  logo,
  name,
  id,
  isSelected,
  onClick
}: Props) => {
  return (
    <Li className={cn('pointer', {
      on: isSelected
    })}
    >
      <Button
        size={{
          width: '100%',
          height: '100%'
        }}
        border={{
          radius: '0'
        }}
        onClick={() => onClick(id)}
      >
        <img
          src={logo}
          alt={name}
        />
      </Button>
    </Li>
  );
};

export default React.memo(NewsUrlCard);

import React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {$WHITE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import Button from '../../inputs/Button';

const Li = styled.li`
  position: relative;
  display: table-cell;
  height: 80px;
  border-right: 1px solid #eee;
  background-color: #f9f9f9;
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;

  &.on {
    background-color: ${$WHITE};
  }

  .button {
    padding-top: 30px;
  }

  img.select-news-icon {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    margin: 0 auto 9px;
  }

  img.news-logo {
    height: 18px;
  }
`;

interface Props {
  logo: string;
  name: string;
  id: number;
  isSelected: boolean;
  onClick: (id: number) => void;
}

const NewsUrlCard: React.FC<Props> = ({
  logo,
  name,
  id,
  isSelected,
  onClick
}) => (
  <Li
    className={cn('pointer', {
      on: isSelected
    })}
  >
    <img
      className="select-news-icon"
      src={staticUrl(isSelected
        ? '/static/images/icon/check/check-white-blue_bg.png'
        : '/static/images/icon/check/check-white-gray_bg.png'
      )}
      alt="해당 신문사 선택"
    />
    <Button
      size={{
        width: '100%',
        height: '100%',
      }}
      border={{
        radius: '0'
      }}
      onClick={() => onClick(id)}
    >
      <img
        className="news-logo"
        src={logo}
        alt={name}
      />
    </Button>
  </Li>
);

export default React.memo(NewsUrlCard);

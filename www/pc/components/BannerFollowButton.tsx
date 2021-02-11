import {$POINT_BLUE, $WHITE} from '../styles/variables.types';
import {staticUrl} from '../src/constants/env';
import * as React from 'react';
import styled from 'styled-components';
import Button from './inputs/Button';
import classNames from 'classnames';

const StyledButton = styled(Button)`
  img {
    width: 7px;
    display: inline-block;
    vertical-align: middle;
    margin: -4px 2px 0 0;
  }
`;

interface Props {
  is_follow: boolean;
  onClick: () => void;
  className?: string;
}

const BannerFollowButton = React.memo<Props>(({is_follow, onClick, className}) => {
  return (
    <StyledButton
      size={{
        width: '60px',
        height: '24px',
      }}
      border={{
        radius: '0',
      }}
      font={{
        size: '11px',
        weight: 'bold',
        color: is_follow ? $WHITE : '',
      }}
      backgroundColor={is_follow ? $POINT_BLUE : $WHITE}
      onClick={() => onClick()}
      className={classNames('banner-follow-button', [className])}
    >
      {is_follow ? (
        <img
          src={staticUrl('/static/images/icon/check/icon-check3.png')}
          alt="팔로우"
          style={{
            width: '10px',
          }}
        />
      ) : (
        <img src={staticUrl('/static/images/icon/check/icon-mini-plus.png')} alt="팔로우" />
      )}
      팔로우
    </StyledButton>
  );
});

export default BannerFollowButton;

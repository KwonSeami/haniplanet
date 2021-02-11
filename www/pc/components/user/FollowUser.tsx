import * as React from 'react';
import Link from 'next/link';
import {staticUrl} from '../../src/constants/env';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE, $TEXT_GRAY} from '../../styles/variables.types';
import styled from 'styled-components';
import Button from '../inputs/Button';
import Avatar from '../AvatarDynamic';
import { fontStyleMixin } from '../../styles/mixins.styles';

const FollowUserLi = styled.li`
  position: relative;
  width: 100%;
  height: 60px;
  padding: 12px 7px 0 15px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};
  
  .avatar > div {
    margin: -2px 6px 0 0;
    vertical-align: middle;
  }

  .user-info {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 40px);
    box-sizing: border-box;
    padding-left: 8px;

    h2 {
      ${fontStyleMixin({
        size: 13,
        weight: '600'
      })}
    }

    p {
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}
    }
  }
`;

const StyledButton = styled(Button)`
  position: absolute;
  right: 15px;
  top: 50%;
  margin-top: -20px;
  
  img {
    width: 7px; 
    display: inline-block;
    vertical-align: middle;
    margin: -4px 2px 0 0;
  }
`;

const FollowUser: React.FC<IFollowPopupUser & {
  onClick: () => void;
  myId: HashId;
}> = React.memo((
    {
      myId,
      id,
      name,
      is_follow,
      avatar,
      last_career,
      onClick,
    },
  ) => (
    <FollowUserLi>
      <Avatar 
        id={id}
        size={40}
        src={avatar}
        userExposeType="real"
      />
      <div className="user-info">
        <h2>{name}</h2>
        {last_career && (
          <p>{last_career}</p>
        )}
      </div>
      {id !== myId && (
        <StyledButton
          size={{
            width: '72px',
            height: '24px',
          }}
          border={{
            radius: '0',
            width: is_follow ? '' : '1px',
            color: is_follow ? '' : $BORDER_COLOR,
          }}
          font={{
            size: '11px',
            weight: 'bold',
            color: is_follow ? $WHITE : '',
          }}
          backgroundColor={is_follow && $POINT_BLUE}
          onClick={() => onClick()}
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
            <img
              src={staticUrl('/static/images/icon/check/icon-mini-plus.png')}
              alt="팔로우"
            />
          )}
          팔로우
        </StyledButton>
      )}
    </FollowUserLi>
  ),
);

export default FollowUser;

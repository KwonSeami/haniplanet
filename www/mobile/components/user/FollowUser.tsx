import * as React from 'react';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../styles/variables.types';
import styled from 'styled-components';
import Avatar from '../AvatarDynamic';
import { fontStyleMixin } from '../../styles/mixins.styles';
import WholeBlueFollowButton from '../WholeBlueFollowButton';

export const FollowUserLi = styled.li`
  position: relative;
  width: 100%;
  height: 60px;
  padding: 12px 7px 0 15px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};

  .avatar {
    display: inline-block;
    vertical-align: middle;
    width: 40px;
    margin: 0;

    & > div {
      margin: -2px 6px 0 0;
      vertical-align: middle;
    }
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
  .whole-blue-follow-button {
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -20px;
  }
`;

const FollowUser: React.FC<IFollowPopupUser & {
  onClick: () => void;
  myId: HashId;
}> = React.memo(
  (
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
        <WholeBlueFollowButton
          is_follow={is_follow}
          onClick={onClick}
        />
      )}
    </FollowUserLi>
  ),
);

export default FollowUser;

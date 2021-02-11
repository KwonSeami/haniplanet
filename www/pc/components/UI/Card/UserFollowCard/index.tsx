import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import UserFollowBtn from './style/UserFollowBtn';
import UserFollowCardBox from './style/UserFollowCardBox';
import {staticUrl} from '../../../../src/constants/env';
import {followUser} from '../../../../src/reducers/orm/user/follow/thunks';
import {$GRAY} from '../../../../styles/variables.types';

interface Props {
  image?: string;
  id: string;
  name: string;
  avatar: string;
  explanation: string;
  className?: string;
  backgroundColor: string;
  hasFollowBtn?: boolean;
  is_follow?: boolean;
}

const UserFollowCardLink = styled.a`
  width: 100px;
  height: 110px;
`;

const UserFollowCard = React.memo<Props>(({
  className,
  avatar,
  explanation,
  id,
  name,
  is_follow,
  hasFollowBtn = false,
}) => {
  const dispatch = useDispatch();
  const followImgName = React.useMemo(
    () => is_follow ? 'icon-check2' : 'icon-mini-plus',
    [is_follow],
  );

  return (
    <Link
      href="/user/[id]"
      as={`/user/${id}`}
      passHref
    >
      <UserFollowCardLink>
        <UserFollowCardBox
          className={className}
          avatar={avatar}
          backgroundColor={is_follow ? '#c2d4eb' : $GRAY}
        >
          <h2>{name}</h2>
          <p>{explanation}</p>
          {hasFollowBtn && (
            <UserFollowBtn
              className={cn('follow-btn', {'is-follow': is_follow})}
              onClick={(e) => {
                e.preventDefault();
                dispatch(followUser(id));
              }}
            >
              <img
                src={staticUrl(`/static/images/icon/check/${followImgName}.png`)}
                alt="팔로우"
              />
              &nbsp;팔로우
            </UserFollowBtn>
          )}
        </UserFollowCardBox>
      </UserFollowCardLink>
    </Link>
  );
});

UserFollowCard.displayName = 'UserFollowCard';
export default UserFollowCard;

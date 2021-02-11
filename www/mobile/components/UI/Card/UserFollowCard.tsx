import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $WHITE, $POINT_BLUE, $FONT_COLOR, $GRAY} from '../../../styles/variables.types';
import {fontStyleMixin, inlineBlockMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import {useDispatch} from 'react-redux';
import {followUser} from '../../../src/reducers/orm/user/follow/thunks';
import Link from 'next/link';
import SmallFollowButton from "../../SmallFollowButton";

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

const Div = styled.div<Pick<Props, 'avatar' | 'backgroundColor' | 'is_follow'>>`
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};
  ${({avatar}) => backgroundImgMixin({img: avatar || staticUrl('/static/images/icon/img-default-user.png')})};
  background-blend-mode: multiply;
  background-color: ${props => props.backgroundColor};

  &:hover {
    background-color: #c2d4eb;
    background-blend-mode: multiply;
    transition: background-color .2s ease;
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      &::after{
        opacity: 0.4;
        background-color: #c2d4eb !important;
      }
    }
  }

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    &::after{
      content:'';
      background-color: ${$FONT_COLOR};
      opacity: 0.6;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  ${props => props.is_follow && `
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      &::after{
        opacity: 0.4;
        background-color: #c2d4eb !important;
      }
    }
  `}

  h2 {
    position: relative;
    z-index: 1;
    padding-bottom: 5px;
    ${fontStyleMixin({
      size: 13,
      weight: 'bold',
      color: $WHITE
    })};
  }

  p {
    position: relative;
    z-index: 1;
    opacity: 0.8;
    ${fontStyleMixin({
      size: 10,
      weight: '600',
      color: $WHITE
    })};
  }
`;

// 작업자: 임용빈
const UserFollowCard = React.memo(({
  className,
  avatar,
  explanation,
  id,
  name,
  is_follow,
  hasFollowBtn = false
}: Props) => {
  const dispatch = useDispatch();

  return (
    <Link href={`/user/${id}`}>
      <a>
        <Div
          avatar={avatar}
          className={className}
          backgroundColor={ is_follow ? '#c2d4eb' : $GRAY }
        >
          <h2>{name}</h2>
          <p>{explanation}</p>
          {hasFollowBtn && (
            <SmallFollowButton
              is_follow={is_follow}
              onClick={e => {
                e.preventDefault();
                dispatch(followUser(id));
              }}
            />
          )}
        </Div>
      </a>
    </Link>
  );
});

UserFollowCard.displayName = 'UserFollowCard';
export default UserFollowCard;

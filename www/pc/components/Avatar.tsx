import * as React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../styles/mixins.styles';
import {$FONT_COLOR, $BORDER_COLOR} from '../styles/variables.types';
import classNames from 'classnames';
import {HashId} from '@hanii/planet-types';
import CroppedImage from './CroppedImage';
import Link from 'next/link';
import {avatarExposeType} from '../src/lib/avatar';

interface Props {
  className?: string;
  hideImage?: boolean;
  hideUserName?: boolean;
  id?: HashId;
  name?: string;
  nick_name?: string;
  size: number;
  src: string;
  userExposeType?: string;
}

interface IWrapperProps extends Pick<Props, 'id' | 'className'> {}

const getAvatarLabel = (userExposeType, user) => {
  switch(userExposeType){
    case 'real':
      return user.name;
    case 'nick':
      return user.nick_name;
    case 'anon':
      return '익명의 유저';
    default:
      return '';
  }
};

const AvatarStructure: React.FC<IWrapperProps> = ({
  children,
  className,
  id
}) => (id ? (
  <Link
    as={`/user/${id}`}
    href="/user/[id]"
    shallow
  >
    <a
      className={classNames(
        'avatar pointer',
        className,
      )}
      onClick={e => !id && e.preventDefault()}
    >
      {children}
    </a>
  </Link>
) : (
  <div
    className={classNames(
      'avatar',
      className
    )}
  >
    {children}
  </div>
));

const AvatarComponent: React.FC<Props> = ({
  className,
  hideImage = false,
  hideUserName = false,
  id,
  name,
  nick_name,
  size,
  src,
  userExposeType
}) => (
  <AvatarStructure
    className={className}
    id={id}
  >
    {!hideImage && (
      <CroppedImage
        alt="프로필 이미지"
        size={size}
        src={avatarExposeType(userExposeType, src)}
      />
    )}
    {!hideUserName && (
      userExposeType
        ? getAvatarLabel(userExposeType, {nick_name, name})
        : nick_name || name
    )}
  </AvatarStructure>
);

const Avatar = styled(AvatarComponent)`
  display: block;
  box-sizing: border-box;
  
  div {
    border-radius: 50%;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    border-collapse: separate;
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    display: inline-block;
    vertical-align: middle;

    &::after { //아바타 이미지 안쪽 테두리
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      box-shadow: 0 0 0 2px ${$BORDER_COLOR} inset;
      border-radius: 50%;
    }
    
    img {
      display: inline-block;
    }
  }

  ${fontStyleMixin({
    size: 14,
    weight: '600',
    color: $FONT_COLOR,
  })};
`;

export default Avatar;

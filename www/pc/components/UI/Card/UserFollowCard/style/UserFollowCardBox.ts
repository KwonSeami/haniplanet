import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $WHITE} from '../../../../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin} from '../../../../../styles/mixins.styles';
import {staticUrl} from '../../../../../src/constants/env';

interface IUserFollowCardBoxProps {
  avatar: string;
  backgroundColor: string;
}

const UserFollowCardBox = styled.div<IUserFollowCardBoxProps>`
  z-index: 1;
  position: relative;
  box-sizing: border-box;
  width: 96px;
  height: 100px;
  padding: 10px;
  border: 1px solid ${$BORDER_COLOR};
  background-blend-mode: multiply;
  background-color: ${props => props.backgroundColor};
  ${({avatar}) => backgroundImgMixin({img: avatar || staticUrl('/static/images/banner/img-default-user.png')})};

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

  h2 {
    position: relative;
    z-index: 1;
    padding-bottom: 5px;
    ${fontStyleMixin({size: 13, weight: 'bold', color: $WHITE})};
  }

  p {
    position: relative;
    z-index: 1;
    opacity: 0.8;
    ${fontStyleMixin({size: 10, weight: '600', color: $WHITE})};
  }
`;

export default UserFollowCardBox;

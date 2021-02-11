import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin} from '../../../../../../styles/mixins.styles';
import { $POINT_BLUE, $WHITE, $TEXT_GRAY, $FONT_COLOR, $BORDER_COLOR, $THIN_GRAY } from '../../../../../../styles/variables.types';

interface IMoaBannerProps {
  img?: string;
  bandAvtar: string;
}

export const MoaBanner = styled.div<IMoaBannerProps>`
  ${({img}) => img && backgroundImgMixin({img: img || ''})};

  width: 250px;
  height: 126px;
  box-sizing: border-box;
  position: relative;
  border: 1px solid ${$BORDER_COLOR};
  background-color: #e8e1d5;

  & > .band-avatar {
    width: 63px;
    height: 63px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -30px 0 0 -28px;
    ${({bandAvatar}) => backgroundImgMixin({
      img: bandAvatar,
      size: '100%'
    })}
    
    &.avatar {
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;    
      width: 100%;
      height: 100%;
      ${({bandAvatar}) => backgroundImgMixin({
        img: bandAvatar,
        size: 'cover'
      })}
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(102, 102, 102, 0.3);
    mix-blend-mode: multiply;
  }
`;

export const Shortcuts = styled.span`
  position: absolute;
  display: none;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 85px;
  box-sizing: border-box;
  padding: 10px 14px;
  background-color: rgba(43, 137, 255, 0.8);
  ${fontStyleMixin({
    size: 12,
    color: $WHITE,
    weight: 'bold'
  })}

  img {
    width: 59px;
    display: block;
  }
`;

export const MoaSliderDiv = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 250px;
  padding-bottom: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};
  &:hover {
    ${MoaBanner} {
      height: 162px;
      transition: all ease-in-out .1s;

      &::after {
        display: none;
      }
    }

    ${Shortcuts} {
      display: block;
    }
  }

  h2 {
    padding: 8px 0 15px;
    ${fontStyleMixin({
      size: 15,
      weight: '600'
    })}
  }
`;


interface IBannerInfoLiProps {
  newCount?: boolean;
}

export const BannerInfoLi = styled.li<IBannerInfoLiProps>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  padding-right: 4px;
  margin-right: 8px;
  
  
  ${fontStyleMixin({
    size: 12,
    color: $TEXT_GRAY
  })}

  span {
    color: ${$FONT_COLOR};
  }

  ${props => props.newCount && `
    span {
      color: ${$POINT_BLUE};
    }
  `}

  &::after {
    content: '';
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background-color: ${$THIN_GRAY};
    position: absolute;
    right: -4px;
    top: 50%;
    margin-top: -1px;
  }
  
  &:last-child::after {
    display: none;
  }
`;

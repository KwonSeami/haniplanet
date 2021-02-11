import styled from 'styled-components';
import {
  $BORDER_COLOR,
  $FONT_COLOR,
  $POINT_BLUE,
  $TEXT_GRAY,
  $THIN_GRAY,
  $WHITE,
} from '../../../../../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin} from '../../../../../../styles/mixins.styles';

interface IMoaBannerProps {
  img?: string;
  bandAvatar: string;
}

export const MyMoaSliderUl = styled.ul`
  width: 100%;
  overflow-x: auto;
  white-space:nowrap;
  padding-top: 30px;

  & > li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 220px;
    margin-right: 7px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    h2 {
      padding: 8px 0 13px;
      ${fontStyleMixin({
        size: 15,
        weight: '600'
      })}
    }
  }
`;

export const MoaBanner = styled.div<IMoaBannerProps>`
  position: relative;
  width: 100%;
  height: 140px;
  border: 1px solid ${$BORDER_COLOR};
  ${({bandAvatar}) => backgroundImgMixin({
    img: bandAvatar,
    color: '#e8e1d5'
  })};
  box-sizing: border-box;

  & > img {
    width: 49px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -30px 0 0 -28px;
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

  .moa-shortcuts {
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    width: 85px;
    padding: 10px 14px 12px;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 12,
      color: $WHITE,
      weight: 'bold'
    })}
    background-color: rgba(43, 137, 255, 0.8);

    img {
      width: 59px;
      display: block;
    }
  }
`;

interface IBannerInfoLiProps {
  newCount?: boolean;
}

export const BannerInfoLi = styled.li<IBannerInfoLiProps>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  padding-right: 2px;
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
  }

  &:last-child::after {
    display: none;
  }
`;

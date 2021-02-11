import styled from 'styled-components';
import {fontStyleMixin, backgroundImgMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $WHITE, $TEXT_GRAY, $FONT_COLOR, $POINT_BLUE, $THIN_GRAY} from '../../../../styles/variables.types';
import ButtonGroup from '../../../inputs/ButtonGroup';

type TabType = 'status' | 'member_status';

interface IMoaBannerProps {
  img?: string;
  bandAvatar: string;
}

interface IButtonProps {
  on: TabType;
}

export const OnClassSliderUl = styled.ul`
  position: absolute;
  width: 100%;
  overflow-x: auto;
  white-space:nowrap;
  padding: 25px 0;
  margin-bottom: -111px;

  > li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 220px;
    margin-right: 7px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    &:first-child {
      margin-left: 20px;
    }

    &:last-child {
      margin-right: 20px;
    }

    h2 {
      padding: 8px 0 13px;
      ${fontStyleMixin({
        size: 15,
        weight: '600'
      })}
    }
  }

  @media screen and (min-width: 680px) {
    > li {
      width: 250px;
      margin-right: 12px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

export const OnClassBanner = styled.div<IMoaBannerProps>`
  position: relative;
  width: 100%;
  height: 140px;
  border: 1px solid ${$BORDER_COLOR};
  ${({bandAvatar}) => backgroundImgMixin({
    img: bandAvatar, 
    size: 'auto 160px',
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

  .onclass-duration {
    position: absolute;
    z-index: 1;
    top: 10px;
    left: 10px;
    height: 25px;
    padding-right: 11px;
    background-color: ${$WHITE};
    border-radius: 19px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 12,
      weight: '600',
    })};

    img {
      width: 25px;
      margin-right: 4px;
      vertical-align: middle;
    }

    b {
      color: ${$POINT_BLUE};
    }
  }

  .onclass-shortcuts {
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;
    width: 85px;
    padding: 10px 14px 12px;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 12,
      color: $WHITE,
      weight: 'bold'
    })};
    background-color: rgba(43, 137, 255, 0.8);

    img {
      width: 59px;
      display: block;
    }
  }

  @media screen and (min-width: 680px) {
    height: 159px;
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
  })};

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


export const StyledButtonGroup = styled(ButtonGroup)<IButtonProps>`
  padding: 8px 0 17px;
  text-align: left;

  li {
    position: relative;
    padding-right: 27px;

    &:first-child::after {
      position: absolute;
      right: 11px;
      top: 50%;
      content: '';
      width: 1px;
      height: 7px;
      margin-top: -3px;
      background-color: ${$BORDER_COLOR};
    }
  }

  button {
    position: relative;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 16,
      weight: '300'
    })};

    ${({on}) => on === 'member_status' ? (`
      &.left-button {
        border-color: ${$POINT_BLUE};
        color: ${$POINT_BLUE};
  
        strong, span {
          color: ${$POINT_BLUE};
        }
      }
    `) : (`
      &.right-button {
        border-color: ${$POINT_BLUE};
        color: ${$POINT_BLUE};

        strong, span {
          color: ${$POINT_BLUE};
        }
      }
    `)};

    span {
      display: inline-block;
      vertical-align: middle;
      padding-left: 7px;
      margin-top: -4px;
      text-decoration: underline;
      ${fontStyleMixin({
        size: 17,
        weight: '300',
        family: 'Montserrat'
      })};
    }
  }

  @media screen and (max-width: 680px) {
    padding: 8px 0 12px;
  }
`;

export const P = styled.p`
  ${fontStyleMixin({
    size: 12,
    color: '#999'
  })};

  @media screen and (max-width: 680px) {
    padding-left: 20px;
  }
`;

export const MyMoaSliderDiv = styled.div`
  width: 320px;

  & > div {
    width: 100%;
    overflow-x:scroll;
  }
`;

export const NoContent = styled.div`
  text-align: center;
  padding: 25px 0 35px;

  .no-content-img {
    width: 93px;
    display: block;
    margin: auto;
  }

  h2 {
    padding: 10px 0 4px;
    ${fontStyleMixin({
      size: 20,
      weight: '300'
    })};
  }

  p {
    ${fontStyleMixin({
      size: 14,
      color: '#95a9e5'
    })};

    img {
      width: 14px;
      display: block;
      margin: auto;
      padding-top: 16px;
    }
  }
`;

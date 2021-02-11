import styled from 'styled-components';
import {heightMixin, fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $WHITE, $POINT_BLUE, $FONT_COLOR, $TEXT_GRAY} from '../../../../../styles/variables.types';

export const Div = styled.div`
  .tab-box {
    background-color: ${$WHITE};
  }

  .tab-box .moa-list-box {
    position: relative;
    padding: 20px 14px 17px 63px;
    width: 100%;
    min-height: 67px;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};

    &:hover {
      mix-blend-mode: multiply;
      background-color: #f9f9f9;
    }

    img {
      width: 41px;
      height: 41px;
      position: absolute;
      left: 15px;
      top: 50%;
      margin-top: -18px; 
      border-radius: 50%;
    }

    h2 {
      ${fontStyleMixin({
        size: 13,
        weight: '600'
      })}
      padding-bottom: 2px;
    }

    p {
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}
    }
  }
`;

interface ITabTitleProps {
  on?: boolean;
}

export const TabTitle = styled.div<ITabTitleProps>`
  position: relative;
  width: 100%;
  ${heightMixin(48)}
  box-sizing: border-box;
  font-size: 15px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  background-color: ${$WHITE};
  

  img {
    position: absolute;
    right: 13px;
    top: 17px;
    width: 12px;
    transform: rotate(90deg);
  }

  span {
    ${fontStyleMixin({
      size: 16,
      weight: '300',
      family: 'Montserrat',
      color: $POINT_BLUE
    })}
    letter-spacing: 0;
    padding-left: 3px;
  }

  ${({on}) => on && `
    border-color: ${$FONT_COLOR};
    font-weight: bold;

    span {
      font-weight: 600;
    }
  `}

  @media screen and (max-width: 680px) {
    padding-left: 18px;
  }
`;
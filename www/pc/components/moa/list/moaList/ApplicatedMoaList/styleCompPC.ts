import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../../../styles/mixins.styles';
import {
  $WHITE,
  $TEXT_GRAY,
  $BORDER_COLOR,
  $POINT_BLUE,
  $FONT_COLOR
} from '../../../../../styles/variables.types';

export const Div = styled.div`
  float: right;
  width: 270px;
  box-sizing: border-box;

  .tab-box {
    background-color: ${$WHITE};

    .tab-content {
      padding-bottom: 18px;

      & > ul {
        height: 240px;
        overflow-y: auto;
        border-bottom: 1px solid ${$BORDER_COLOR};

        li:first-child {
          border-top: 0;
        }
      }
    }

    .tab-content .moa-list-box {
      position: relative;
      padding: 20px 14px 17px 63px;
      width: 100%;
      min-height: 67px;
      box-sizing: border-box;
      border-top: 1px solid ${$BORDER_COLOR};

      &:hover {
        mix-blend-mode: multiply;
        background-color: #f9f9f9;
      }

      img {
        width: 41px;
        position: absolute;
        height: 41px;
        left: 15px;
        top: 50%;
        border-radius: 50%;
        margin-top: -18px;
      }

      h2 {
        ${fontStyleMixin({
          size: 13,
          weight: '600',
        })}
        padding-bottom: 2px;
      }

      p {
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY,
        })}
      }
    }
  }
`;

interface ITabLiProps {
  on?: boolean;
}

export const TabLi = styled.li<ITabLiProps>`
  position: relative;
  float: left;
  width: 50%;
  ${heightMixin(63)}
  box-sizing: border-box;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  background-color: ${$WHITE};
  cursor: pointer;

  span {
    ${fontStyleMixin({
      size: 15,
      weight: '300',
      family: 'Montserrat',
      color: $POINT_BLUE,
    })}
    letter-spacing: 0;
    padding-left: 2px;
  }

  ${({on}) => on && `
    border-color: ${$FONT_COLOR};
    font-weight: 600;

    span {
      font-weight: 600;
    }
  `}

  &:first-child::after {
    content: '';
    position: absolute;
    right: -1px;
    top: 50%;
    z-index: 1;
    width: 1px;
    height: 8px;
    margin-top: -3px;
    background-color: ${$BORDER_COLOR};
  }
`;

export const NoContentLi = styled.li`
  text-align: center;
  height: 100%;
  padding-top: 96px;
  box-sizing: border-box;
  ${fontStyleMixin({
    size: 15,
    color: $TEXT_GRAY
  })}
`;
import styled from 'styled-components';
import ButtonGroup from '../../../../inputs/ButtonGroup';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$POINT_BLUE, $BORDER_COLOR} from '../../../../../styles/variables.types';

type TabType = 'status' | 'member_status';

interface IButtonProps {
  on: TabType;
}

export const StyledButtonGroup = styled(ButtonGroup)<IButtonProps>`
  padding: 8px 0 17px;
  text-align: left;

  li {
    position: relative;
    padding-right: 27px;

    &:first-child::after {
      position: absolute;
      right: 13px;
      top: 50%;
      content: '';
      width: 1px;
      height: 6px;
      margin-top: -3px;
      background-color: ${$BORDER_COLOR};
    }
  }

  button {
    position: relative;
    box-sizing: border-box;
    letter-spacing: -2px;
    ${fontStyleMixin({
      size: 16,
      weight: '300'
    })}

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
    `)}

    strong {
      display: inline-block;
      vertical-align: middle;
      margin: -2px 0 0 2px;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold'
      })}
    }

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
      })}
    }
  }

  @media screen and (max-width: 680px) {
    padding: 8px 0 7px;
  }
`;

export const P = styled.p`
  ${fontStyleMixin({
    size: 12,
    color: '#999'
  })}
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
  padding: 15px 0 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: #f8f6ee;
  }

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
    })}
  }

  p {
    ${fontStyleMixin({
      size: 14,
      color: '#c7bfb7'
    })}

    img {
      width: 14px;
      display: block;
      margin: auto;
      padding-top: 16px;
    }
  }
`;
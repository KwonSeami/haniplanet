import styled from 'styled-components';
import ButtonGroup from '../../../../inputs/ButtonGroup';
import {
  fontStyleMixin,
  heightMixin
} from '../../../../../styles/mixins.styles';
import {
  $FONT_COLOR,
  $POINT_BLUE
} from '../../../../../styles/variables.types';

type TabType = 'status' | 'member_status';

interface IButtonProps {
  on: TabType;
}

export const StyledButtonGroup = styled(ButtonGroup)<IButtonProps>`
  position: absolute;
  right: 9px;
  top: 31px;

  li {
    padding-left: 8px;
  }

  button {
    position: relative;
    width: 150px;
    ${heightMixin(42)};
    border-radius: 29px;
    text-align: left;
    box-sizing: border-box;
    padding: 0 23px;
    border: 1px solid ${$FONT_COLOR};
    ${fontStyleMixin({
      size: 16,
      weight: '300',
    })}

    ${({on}) => on === 'member_status' ? (`
      &.left-button {
        border-color: ${$POINT_BLUE};
        color: ${$POINT_BLUE};

        strong, span {
          color: ${$POINT_BLUE};
        }
      }
    `) : on === 'status' && (`
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
      margin-top: -4px;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold',
      })}
    }

    span {
      position: absolute;
      right: 28px;
      top: -1px;
      text-decoration: underline;
      ${fontStyleMixin({
        size: 17,
        weight: '300',
        family: 'Montserrat'
      })}
    }
  }
`;

export const NoContent = styled.div`
  text-align: center;

  .no-content-img {
    width: 104px;
    display: block;
    margin: auto;
  }

  h2 {
    padding: 14px 0 5px;
    ${fontStyleMixin({
      size: 20,
      weight: '300',
    })}
  }

  p {
    ${fontStyleMixin({
      size: 14,
      color: '#c7bfb7',
    })}

    img {
      width: 14px;
      display: block;
      margin: auto;
      padding-top: 26px;
    }
  }
`;
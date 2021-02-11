import styled from 'styled-components';
import { $BORDER_COLOR, $FONT_COLOR } from '../../../styles/variables.types';
import { fontStyleMixin } from '../../../styles/mixins.styles';

export const TabUl = styled.ul`
  display: flex;

  li {
    flex: 1 0 0;
    padding: 8px 0;
    text-align: center;
    box-sizing: border-box;
    border-top: 1px solid ${$BORDER_COLOR};
    border-bottom: 1px solid ${$BORDER_COLOR};
    

    & + li {
      border-left: 1px solid ${$BORDER_COLOR};
    }

    &.on {
      border-bottom-color: ${$FONT_COLOR};
    }

    &.only {
      text-align: left;

      &.on {
        border-bottom-color: ${$BORDER_COLOR};
      }
    }

    img {
      display: inline-block;
      vertical-align: middle;
      width: 24px;
      height: 24px;
    }

    p {
      display: inline-block;
      vertical-align: middle;
      margin: 0 3px 0 2px;
      font-size: 13px;
    }

    span {
      vertical-align: middle;        
      ${fontStyleMixin({
        size: 17,
        family: 'Montserrat'
      })}
    }
  }
`;
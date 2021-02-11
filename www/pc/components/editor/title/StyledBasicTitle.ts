import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin} from "../../../styles/mixins.styles";
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE} from "../../../styles/variables.types";
import {staticUrl} from "../../../src/constants/env";

const StyledBasicTitle = styled.div`
  padding: 19px 30px 4px;
  
  .avatar {
    & > div {
      margin: -2px 6px 0 0;
      vertical-align: middle;
    }
  }

  a {
    display: inline-block;
    vertical-align: 0;
    margin: 0 4px 0 0;
    ${fontStyleMixin({size: 15, weight: '600'})};
  }

  ul {
    display: inline-block;

    li {
      display: inline-block;
      font-size: 12px;
      padding: 2px 8px 2px 6px;
      border-radius: 3px;
      border: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;
      cursor: pointer;

      & +li {
        margin-left: 3px;
      }

      &.on {
        padding: 2px 6px 2px 7px;
        color: ${$POINT_BLUE};
        border-color: ${$POINT_BLUE};

        &::before {
          content: '';
          display: inline-block;
          vertical-align: -2px;
          width: 10px;
          height: 12px;
          ${backgroundImgMixin({img: staticUrl('/static/images/icon/check/icon-editor-select.png')})};
        }
      }
    
      &:not(.on) {
        &:hover {
          border-color: ${$FONT_COLOR};
        }
      }
    }
  }

  span {
    font-size: 11px;
    margin-left: 5px;
  }
`;

export default StyledBasicTitle;

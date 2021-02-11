import styled from 'styled-components';
import {$BORDER_COLOR, $WHITE, $POINT_BLUE, $GRAY} from '../../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';

const EditorWrapper = styled.div`
  width: 680px;
  margin: 20px auto;
  border-radius: 8px;
  background-color: ${$WHITE};
  
  .akEditor {
    border: 0 !important;
  }

  .editor-bot-wrapper {
    position: relative;
    padding: 12px 30px;
    border-top: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    .community-Menu {
      margin: 3px 0 7px;

      li {
        display: inline-block;
        padding: 7px 12px;
        margin: 0 4px 4px 0;
        border-radius: 3px;
        border: 1px solid ${$BORDER_COLOR};
        transition: all 0.1s cubic-bezier(0.25,0.1,0.25,1);
        box-sizing: border-box;
        cursor: pointer;
        ${fontStyleMixin({size: 14, weight: '600'})};
        
        &.on {
          padding-left: 27px;
          color: ${$POINT_BLUE};
          border-color: ${$POINT_BLUE};
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/check/icon-check2.png'),
            size: '11px 11px',
            position: 'left 12px center',
          })};
        }

        &:not(.on) {
          &:hover {
            border-color: ${$GRAY};
          }
        }
      }
    }

    > p {
      font-size: 14px;
      margin-bottom: 8px;
      
      span {
        margin-right: 6px;
        ${fontStyleMixin({
          size: 16,
          weight: '300',
          color: $POINT_BLUE,
          family: 'Montserrat',
        })};
      }
    }

    .tag-list {
      margin-top: 5px;

      li {
        display: inline-block;
      }
    }
    
    .embed-urlcard {
      margin-left: 0;
      margin-right: 0;
    }
  }
`;

export default EditorWrapper;

import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../styles/variables.types';

const EditorWrapper = styled.section`
  max-width: 680px;
  margin: 0 auto;
  background-color: ${$WHITE};

  .editor-title {
    position: relative;

    .user-select {
      padding: 15px 15px 4px;

      a {
        display: inline-block;
        vertical-align: 0;
        margin: 0 6px 0 0;
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
          

          & +li {
            margin-left: 3px;
          }

          &.on {
            padding: 2px 6px 1px 7px;
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
        }
      }

      span {
        font-size: 11px;
        margin-left: 5px;
      }
    }
    
    .counseling-select {
      padding: 10px 15px 20px;
      margin-bottom: 6px;
      background-color: #f6f7f9;

      h2 {
        margin-bottom: 8px;
        text-align: center;
        background-color: ${$WHITE};
        ${heightMixin(45)}
        ${fontStyleMixin({size: 16, weight: '300'})};

        strong {
          margin-right: 3px;
        }
      }

        > ul {
          margin-top: 18px;
          
          > li {
            display: block;
            margin-bottom: 24px;

            &:last-child {
              margin-bottom: 0;
            }

            h3 {
              line-height: 10px;
              box-sizing: border-box;
              ${fontStyleMixin({size: 11, weight: 'bold'})};
            }

            > div {
              ul {
                padding-top: 12px;

                li {
                  display: inline-block;
                  vertical-align: middle;
                  padding-right: 30px;
                }
              }
            }
          }
        }

        > em {
          font-style: normal;
          ${fontStyleMixin({size: 11, color: '#ea6060'})};
        }
      }

    .title-or-Range {
      margin: 0 15px;
      padding-bottom: 4px;
      border-bottom: 1px solid ${$BORDER_COLOR};
   
      .title-input {
        width: 100%;
        height: 40px;
        border-width: 0;
        box-sizing: border-box;
        ${fontStyleMixin({size: 21, weight: '300'})};

        &::placeholder {
          color: #bbb;
        }
      }

      .user-option-box {
        display: inline-block;
        margin-left: 12px;

        li {
          display: inline-block;

          & + li {
            margin-left: 15px;
          }
        }
      }
    }
  }
  
  .akEditor {
    border: 0 !important;
  }

  .editor-bot-wrapper {
    position: relative;
    padding: 15px 15px;
    border-top: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    .community-Menu {
      margin-right: -15px;
      overflow: scroll hidden;

      ul{
        margin-bottom: 7px;
        white-space: nowrap;

        li {
          display: inline-block;
          padding: 7px 12px;
          margin-right: 4px;
          border-radius: 3px;
          border: 1px solid ${$BORDER_COLOR};
          transition: all 0.1s cubic-bezier(0.25,0.1,0.25,1);
          box-sizing: border-box;
          
          ${fontStyleMixin({size: 14, weight: '600'})};

          &:last-child {
            margin-right: 15px;
          }
          
          &.on {
            padding-left: 27px;
            color: ${$POINT_BLUE};
            border-color: ${$POINT_BLUE};
            ${backgroundImgMixin({
              img: staticUrl('/static/images/icon/check/icon-check2.png'),
              size: '11px 11px',
              position: 'left 12px center'
            })};
          }
        }
      }
    }

    > p {
      font-size: 12px;
      margin-bottom: 5px;
      
      span {
        vertical-align: -1px;
        margin-right: 3px;
        ${fontStyleMixin({
          size: 16,
          weight: '300',
          color: $POINT_BLUE,
          family: 'Montserrat'
        })};
      }
    }

    .tag-list {
      margin-top: 5px;

      li {
        display: inline-block;
      }
    }
  }
`;

export default EditorWrapper;

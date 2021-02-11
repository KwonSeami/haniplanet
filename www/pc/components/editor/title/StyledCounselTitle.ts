import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR} from '../../../styles/variables.types';

const StyledCounselTitle = styled.div`
  padding: 14px 30px 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  .close {
    position: absolute;
    top: 13px;
    right: 13px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    cursor: pointer;
  }

  h2 {
    float: left;
    font-size: 15px;

    &::before {
      content: '';
      display: block;
      margin: 15px 0 10px 2px;
      width: 11px;
      height: 5px;
      background-color: ${$FONT_COLOR};
    }

    strong {
      display: block;
      margin-bottom: 2px;
    }
  }

  > div {
    padding-left: 180px;

    > ul {
      > li {
        display: block;
        margin-bottom: 3px;

        h3 {
          float: left;
          width: 100px;
          border-bottom: 1px solid ${$BORDER_COLOR};
          box-sizing: border-box;
          ${fontStyleMixin({size: 11, weight: 'bold'})};
          ${heightMixin(41)};
        }

        > div {
          height: 41px;
          padding-left: 120px;
          
          ul {
            padding-top: 10px;

            li {
              display: inline-block;
              vertical-align: middle;
              padding-right: 27px;
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
`;

export default StyledCounselTitle;
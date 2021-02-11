import styled from 'styled-components';
import {
  fontStyleMixin
} from '../../../../styles/mixins.styles';
import {
  $FONT_COLOR
} from '../../../../styles/variables.types';

export const Div = styled.div`
  width: 1090px;
  box-sizing: border-box;
  margin: auto;
  padding: 37px 0 85px;
  
  .left-moa-box {
    position: relative;
    float: left;
    padding-top: 30px;
    width: calc(100% - 305px);

    & > h2 {
      position: relative;
      font-size: 13px;
      padding: 4px 0 28px;

      span {
        padding-right: 4px;
        ${fontStyleMixin({
          size: 30,
          weight: '300',
        })};
        vertical-align: middle;
        display: inline-block;
        margin-top: -5px;
      }

      p {
        margin-top: 5px;
        ${fontStyleMixin({
          size: 12,
          color: '#999'
        })};
      }
    }
  }

  .moa-guide {
    text-align: right;
    padding: 3px 0 9px;

    a {
      ${fontStyleMixin({
        size: 12,
        weight: '600',
      })}
    }

    img {
      width: 18px;
      display: inline-block;
      vertical-align: middle;
      margin-top: -5px;
      padding-left: 1px;
    }
  }
`;

export const LineSpan = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: 150px;
  height: 1px;
  background-color: ${$FONT_COLOR};
  margin: -2px 0 0 5px !important;
`;

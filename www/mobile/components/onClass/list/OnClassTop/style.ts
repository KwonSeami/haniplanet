import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';

export const Div = styled.div`
  width: 1090px;
  box-sizing: border-box;
  margin: auto;
  padding: 37px 0;

  .moa-guide {
    text-align: right;
    padding-bottom: 12px;

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
  
  .onclass-list-wrapper {
    position: relative;
    width: 100%;

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
`;
import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE} from '../../../../../styles/variables.types';


const NoticeUl = styled.ul`
  position: relative;
  max-height: 400px;
  padding-bottom: 33px;
  box-sizing: border-box;
  overflow-y: auto;
  
  &::-webkit-scrollbar { 
    display: none !important;
  }

  li:last-child a > div {
    border-bottom: 0;
  }

  li a {
    > div {
      position: relative;
      display: table;
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      padding: 16px 20px 14px;
      border-bottom: 1px solid ${$BORDER_COLOR}; 

      > div {
        display: table-cell;
        vertical-align: top;
        box-sizing: border-box;
        width: 34px;

        div {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          overflow: hidden;
        }

        img {
          position: absolute;
          top: 50%;
          width: 100%;
          transform: translateY(-50%);
        }
      }

      p {
        display: table-cell;
        vertical-align: middle;
        box-sizing: border-box;
        font-size: 13px;
        width: calc(100% - 34px);
        padding-right: 55px;

        & + span {
          position: absolute;
          right: 20px;
          top: 50%;
          margin-top: -7px;
          ${fontStyleMixin({
            size: 12,
            weight: '600',
            color: `${$POINT_BLUE} !important`
          })};
    
          &.ring::after {
            content: '';
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: ${$POINT_BLUE};
            position: absolute;
            top: -4.5px;
            right: -6px;
          }
        }
      }
    }

    &:hover p {
      text-decoration: underline;
    }

    &.read-at > div {
      background-color: #f9f9f9;

      div, p, span {
        opacity: 0.4;
        color: ${$FONT_COLOR};
      }
    }
  }
`;

export default NoticeUl;

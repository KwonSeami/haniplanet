import styled, {keyframes} from 'styled-components';
import {$WHITE, $FONT_COLOR, $TEXT_GRAY, $POINT_BLUE, $BORDER_COLOR} from './variables.types';
import {fontStyleMixin} from './mixins.styles';

export const toastAlarmOpacity = keyframes`
  0% {
    opacity: 0;
  }

  15% {
    opacity: 1;
  }

  85% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

const StyledToastRendererLi = styled.li`
  width: 370px;
  height: 84px;
  margin: 5px 0;

  > div {
    position: relative;
    height: 100%;
    border-radius: 19px;
    border: 1px solid ${$BORDER_COLOR};
    background-color: ${$WHITE};
    box-shadow: 1px 1px 9px -1px rgba(99, 99, 99, 0.2);
    transition: background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    animation: 5s ${toastAlarmOpacity} ease-in-out;
    opacity: 0;

    &:hover {
      background-color: #f9f9f9;
    }
    
    &.on {
      border: 1px solid ${$POINT_BLUE};
    }

    > span {
      position: absolute;
      top: 15px;
      right: 15px;
      cursor: pointer;

      img {
        width: 11px;
        height: 11px;
      }
    }
    
    a {
      position: relative;
      display: table;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
  
      > .middle {
        position: relative;
        display: table-cell;
        vertical-align: middle;
        padding: 0 50px 0 15px;
  
  
        > div {
          display: table-cell;
          vertical-align: middle;
        
          .profile-img {
            position: relative;
            width: 28px;
            height: 28px;
            margin: -23px 6px 0 0;
            border-radius: 50%;
            overflow: hidden;
  
            img {
              width: 100%;
              height: 100%;
              //TODO: 아바타 센터 크롭 컴포넌트 적용
              object-fit: cover;
            }
          }
  
          p {
            display: block;
            margin-bottom: 3px;
            line-height: 18px;
            ${fontStyleMixin({
              size: 13,
              color: $FONT_COLOR
            })}; 
  
            @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
              max-height: 36px;
            }
          }
  
          > span {
            ${fontStyleMixin({size: 12, color: $TEXT_GRAY})};
          }
        }
      }
    }
  }
`;

export default StyledToastRendererLi;
import styled from 'styled-components';
import {staticUrl} from '../../../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY} from '../../../../../styles/variables.types';

const PointCalculatorArea = styled.div`
  padding: 11px 0 20px;
  text-align: center;
  background-color: #f6f7f9;
  border-top: 1px solid ${$FONT_COLOR};

  h3 {
    padding-bottom: 22px;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY
    })}
  }


  ul.calculate-list {
    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      width: 33.333%;
      box-sizing: border-box;
  
      dt {
        padding-bottom: 4px;
        ${fontStyleMixin({
          size: 12,
          weight: 'bold'
        })}
      }
  
      dd {
        ${fontStyleMixin({
          size: 21,
          weight: '300',
          color: $TEXT_GRAY,
          family: 'Montserrat'
        })}
      }
  
      &::before {
        content: '';
        width: 23px;
        height: 23px;
        position: absolute;
        left: -13px;
        top: 50%;
        margin-top: -14px;
      }
  
      &.expected-point {
        dd {
          ${fontStyleMixin({color: $FONT_COLOR})}
        }
        
        &::before {
          ${backgroundImgMixin({
            img: staticUrl("/static/images/icon/icon-payment-minus.png")
          })}
        }
  
        &.expected-charge-point::before {
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/icon-payment-plus.png'),
          })}
        }
      }
  
      &.payment-point {
        dt {
          padding-left: 7px;
        }
    
        dd {
          ${fontStyleMixin({color: $POINT_BLUE})}
        }
  
        &::before {
          ${backgroundImgMixin({
            img: staticUrl("/static/images/icon/icon-equals.png")
          })}
        }
      }
    }
  }

  p {
    position: relative;
    margin: 19px 14px 0;
    padding: 5px 15px;
    background-color: #ecedef;
    border: 1px solid ${$BORDER_COLOR};
    font-size: 13px;
    text-align: right;

    strong {
      position: absolute;
      left: 15px;
      top: 7px;
      font-size: 12px;
    }

    span {
      display: inline-block;
      vertical-align: middle;
      margin: -2px 3px 0 0;
      ${fontStyleMixin({
        size: 22,
        weight: '300',
        color: $TEXT_GRAY,
        family: 'Montserrat'
      })}
      
      &.active {
        color: ${$FONT_COLOR};
      }
    }
  }
  
  ul.desc-list {
    text-align: start;
    margin: 10px 14px 0 14px;
    color: #999;
    
    span {
      color: ${$POINT_BLUE};
    }
  }
`;

export default PointCalculatorArea;

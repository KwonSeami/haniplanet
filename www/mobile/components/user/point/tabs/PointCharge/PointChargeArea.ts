import styled from 'styled-components';
import {staticUrl} from '../../../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE} from '../../../../../styles/variables.types';

const PointChargeArea = styled.div`
  position: relative;
  margin: auto;
  padding: 15px 0;
  border-top: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  & > div {
    max-width: 680px;
    margin: auto;
  }

  .error {
    display: block;
    ${fontStyleMixin({
      size: 11,
      color: '#f32b43'
    })}
  }

  .my-point {
    position: relative;
    width: 230px;
    margin: auto;
    padding: 0 5px 4px 0;
    border-bottom: 1px solid ${$FONT_COLOR};

    h3 {
      position: absolute;
      left: 0;
      top: 7px;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold'
      })}
    }

    p {
      text-align: right;
      ${fontStyleMixin({
        size: 24,
        weight: '300',
        color: $POINT_BLUE,
        family: 'Montserrat'
      })}

      img {
        width: 15px;
        display: inline-block;
        vertical-align: middle;
        margin: -4px 3px 0 0;
      }
    }
  }

  .charge-point {
    position: relative;
    
    margin: auto;
    padding: 15px;

    & > p {
      padding-bottom: 8px;
      font-size: 14px;
      text-align: center;
    }

    .error {
      margin: -9px 0 -7px;
    }

    .point-menu {
      padding-bottom: 13px;

      li {
        margin-bottom: -1px;
        padding: 9px 20px 7px 18px;
        border: 1px solid ${$BORDER_COLOR};
        

        dt, dd {
          display: inline-block;
          vertical-align: middle;
          width: 50%;
          font-size: 14px;
          text-align: right;
          box-sizing: border-box;

          span {
            display: inline-block;
            vertical-align: middle;
            margin-top: -2px;
            padding-right: 1px;
            ${fontStyleMixin({
              size: 18,
              family: 'Montserrat'
            })}
          }
        }
        
        dt {
          position: relative;
          text-align: left;

          &::after {
            content: '';
            width: 31px;
            height: 13px;
            position: absolute;
            right: -16px;
            top: 50%;
            margin-top: -7px;
            ${backgroundImgMixin({
              img: staticUrl("/static/images/icon/arrow/icon-short-arrow.png"),
            })}
          }

          span {
            color: ${$POINT_BLUE};
          }

          img {
            width: 15px;
            display: inline-block;
            vertical-align: middle;
            margin: -4px 3px 0 0;
          }
        } 

        &.on {
          background-color: #f6f7f9;
        }

        &:hover {
          position: relative;
          z-index: 1;
          border-color: ${$FONT_COLOR};
        }
      }
    } 
  }

  .charge-guide {
    
    margin: auto;
    padding: 22px 0;

    h3 {
      padding-bottom: 9px;
      font-size: 16px;

      span {
        display: block;
        padding-top: 5px;
        ${fontStyleMixin({
          size: 12,
          color: $GRAY
        })}
      }
    }

    .error {
      margin: 4px 0 -13px;
    }

    @media screen and (max-width: 680px) {
      padding: 22px 15px;
    }
  }

  .charge-agree {
    
    margin: 0 auto;
    position: relative;
    padding-bottom: 27px;

    p {
      margin: 15px 0 -2px;
      height: 128px;
      overflow-y: scroll;
      border: 1px solid ${$BORDER_COLOR};
    }

    .error {
      margin: 5px 0 -5px;
    }

    @media screen and (max-width: 680px) {
      padding: 0 15px 27px;
    }
  }
`;

export default PointChargeArea;

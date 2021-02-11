import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE} from '../../../../../styles/variables.types';
import {staticUrl} from '../../../../../src/constants/env';

const PointChargeArea = styled.div`
  position: relative;
  height: 575px;
  padding: 48px 75px 0;
  box-sizing: border-box;
  overflow-y: auto;

  .error {
    display: block;
    ${fontStyleMixin({
      size: 11,
      color: '#f32b43'
    })}
  }

  .my-point {
    width: 230px;
    padding: 0 2px 4px 0;
    position: absolute;
    right: 75px;
    top: 15px;
    border-bottom: 1px solid ${$FONT_COLOR};

    h3 {
      position: absolute;
      left: 3px;
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

    & > p {
      padding-bottom: 10px;
      font-size: 14px;
    }

    .error {
      margin: -24px 0 7px;
    }

    .point-menu {
      padding-bottom: 28px;

      li {
        margin-bottom: -1px;
        padding: 6px 20px 7px;
        border: 1px solid ${$BORDER_COLOR};
        cursor: pointer;

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
    padding: 21px 0 19px;

    h3 {
      padding-bottom: 8px;
      font-size: 16px;

      span {
        display: inline-block;
        vertical-align: middle;
        padding-left: 6px;
        ${fontStyleMixin({
          size: 12,
          color: $GRAY
        })}
      }
    }

    .error {
      padding-top: 3px;
      margin-bottom: -12px;
    }
  }

  .charge-agree {
    position: relative;

    p {
      margin: 15px 0 30px;
      height: 128px;
      overflow-y: scroll;
      border: 1px solid ${$BORDER_COLOR};
    }

    .error {
      padding-top: 3px;
      margin-bottom: -5px;
    }
  }
`;

export default PointChargeArea;

import styled from 'styled-components';
import {$WHITE, $BORDER_COLOR, $POINT_BLUE, $FONT_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';

const LAYOUT_WIDTH = 1090;

export const PaymentLayoutDiv = styled.div`
  margin: 0 auto;
  width: ${LAYOUT_WIDTH}px;
`;

export const PaymentWrapperDiv = styled.div`
  header {
    .background-wrap {
      background-color: #f6f7f9;
      overflow: hidden;

      .tab-title {
        margin: 48px 0 52px;
        text-align: center;

        li {
          display: inline-block;
          vertical-align: middle;
          
          a {
            vertical-align: middle;
            line-height: 20px;
            ${fontStyleMixin({
              size: 24,
              weight: '600',
              color: $TEXT_GRAY
            })};
          }

          & ~ li:before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            width: 1px;
            height: 18px;
            margin: 0 16px;
            border-left: 1px solid ${$BORDER_COLOR};
          }

          &.on {
            a {
              color: ${$FONT_COLOR};
            }
          }
        }
      }
    }
  }

  .date-wrap {
    margin: 30px 0;
    text-align: center;

    ul {
      display: inline-block;
      vertical-align: middle;

      li {
        display: inline-block;
        vertical-align: middle;

        button {
          width: 70px;
          height: 34px;
          font-size: 14px;
          border-radius: 2px;
          border: 1px solid ${$BORDER_COLOR};
          background-color: ${$WHITE};
          transition: all 0.3s;
          cursor: pointer;

          &:hover {
            border-color: ${$FONT_COLOR};
          }
          &.on {
            border-color: ${$FONT_COLOR};
            background-color: #f9f9f9;
          }
        }

        & ~ li {
          margin-left: 4px;
        }

      }
    }

    > div {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;

      li ~ li {
        margin: 0;

        &:before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 8px;
          height: 1px;
          margin: -4px 6px 0;
          border-bottom: 1px solid ${$FONT_COLOR};
        }
      }
      
      .DayPickerInput {
        input {
          width: 124px;
          height: 34px;
          padding-left: 37px;
          ${fontStyleMixin({
            size: 14,
            weight: '600',
            family: 'Montserrat'
          })};
          border-radius: 2px;
          border: 1px solid ${$BORDER_COLOR};
          background-color: #fbfbfb;
          transition: all 0.3s;
          box-sizing: border-box;

          &:hover {
            border-color: ${$FONT_COLOR};
          }

          &::placeholder {
            letter-spacing: -0.5px;
            ${fontStyleMixin({
              weight: 'normal',
              color: $TEXT_GRAY,
              family: 'Montserrat'
            })};
          }
        }
      }

      button {
        display: inline-block;
        vertical-align: middle;
        width: 70px;
        height: 34px;
        margin-left: 4px;
        ${fontStyleMixin({
          size: 14,
          color: $WHITE
        })};
        border-radius: 2px;
        background-color: ${$FONT_COLOR};
      }
    }
  }

  .data-list {
    width: ${LAYOUT_WIDTH}px;
    margin: 0 auto 100px;

    h2 {
      padding: 1px 0 8px;
      line-height: 19px;
      ${fontStyleMixin({
        size: 15,
        weight: '600',
        family: 'Montserrat'
      })};
      border-bottom: 1px solid ${$FONT_COLOR};
    }

    > li {
      & ~ li {
        margin-top: 22px;
      }
    }
  }
`;


export const PaymentTabDiv = styled.div`
  text-align: center;
  font-size: 0;
  
  ul {
    display: inline-block;
    width: auto;
    border: 1px solid ${$BORDER_COLOR};

    li {
      position: relative;
      float: left;
      width: ${Math.floor(LAYOUT_WIDTH/4)}px;
      height: 62px;
      line-height: 60px;
      background-color: ${$WHITE};
      transition: all 0.3s;
      box-sizing: border-box;
      text-align: left;
    
      & ~ li {
        border-left: 1px solid ${$BORDER_COLOR};
      }

      &:hover {
        background-color: #fbfbfb;
      }

      &.on {
        background-color: #499aff;

        i {
          background-color: ${$WHITE};
        }

        p {
          color: ${$WHITE};
          text-decoration: underline;
        }

        span {
          color: ${$WHITE};
        }
      }

      i {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 40px;
        height: 40px;
        margin: 0 8px 0 13px;
        text-align: center;
        border-radius: 50%;
        background-color: ${$FONT_COLOR};

        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 22px;
        }
      }
      
      p {
        display: inline-block;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 15,
          weight: '600'
        })};
      }

      span {
        position: absolute;
        top: 2px;
        right: 25px;
        ${fontStyleMixin({
          size: 22,
          weight: '600',
          color: $POINT_BLUE,
          family: 'Montserrat'
        })}
      }
    }
  }
`;
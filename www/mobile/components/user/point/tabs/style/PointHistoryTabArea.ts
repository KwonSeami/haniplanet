import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../../../../styles/variables.types';
import {fontStyleMixin, heightMixin} from '../../../../../styles/mixins.styles';

const PointHistoryTabArea = styled.div`
  padding-bottom: 100px;

  & > div:first-child {
    width: 100%;
    padding: 12px 0;
    margin-top: -1px;
    line-height: 1.5;
    background-color: #f5f7f9;

    @media screen and (max-width: 680px) {
      position: static;
      padding: 12px 15px;
      width: auto;
      margin-left: 0;
    }

    p {
      max-width: 680px;
      font-size: 12px;
      margin: auto;

      @media screen and (max-width: 680px) {
        margin-left: 0;
      }

      span {
        ${fontStyleMixin({
          color: $POINT_BLUE,
          weight: '600'
        })}
      }
    }
  }

  & > div:nth-child(2) {
    max-width: 680px;
    margin: auto;
  }
  
  .point-tab-details {
    padding: 12px 0 0;

    li {
      position: relative;
      display: inline-block;
      margin: 0 10px;
      letter-spacing: -0.2px;
      
      ${fontStyleMixin({
        size: 16,
        color: $TEXT_GRAY,
        weight: '600'
      })}

      &:first-child {
        margin-left: 0;
      }

      @media screen and (max-width: 680px) {
        &:first-child {
          margin-left: 15px;
        }
      }

      & + li::before {
        content: '';
        position: absolute;
        top: 8px;
        left: -10px;
        width: 1px;
        height: 10px;
        background-color: ${$BORDER_COLOR};
      }

      &.on {
        color: ${$POINT_BLUE};
        text-decoration: underline;
      }

      a:hover {
        color: unset;
      }
    }
  }

  .point-tab-label {
    padding: 13px 0 9px;
    border-bottom: 1px solid ${$FONT_COLOR};

    @media screen and (max-width: 680px) {
      padding: 13px 15px 9px;
    }

    li {
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
      
      width: 54px;
      ${heightMixin(24)};
      box-sizing: border-box;
      border: 1px solid ${$BORDER_COLOR};
      border-radius: 16px;
      text-align: center;
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY,
        weight: '600'
      })}

      &.all {
        color: ${$FONT_COLOR};
        border-color: ${$FONT_COLOR};
      }
      
      &.charge, &.given {
        border-color: ${$POINT_BLUE} !important;
        color: ${$POINT_BLUE} !important;
      }
      
      &.spent, &.withdrawal {
        border-color: #f32b43 !important;
        color: #f32b43 !important;
      }
    }
  }
  
  .infinite-scroll {
    padding-top: 0;
  }

  .point-table {
    li {
      position: relative;
      width: 100%;
      height: 60px;
      padding: 9px 0 11px;
      border-bottom: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;

      @media screen and (max-width: 680px) {
        padding: 9px 15px 11px;
      }

      .date {
        display: block;
        font-size: 12px;
      }

      p {
        display: inline-block;
        vertical-align: middle;
        max-width: 225px;
        font-size: 14px;

        span.point-type {
          padding-right: 5px;
          ${fontStyleMixin({
            size: 12,
            weight: 'bold'
          })};
    
          &.charge, &.given {
          border-color: ${$POINT_BLUE} !important;
          color: ${$POINT_BLUE} !important;
          }
        
          &.spent, &.withdrawal {
            border-color: #f32b43 !important;
            color: #f32b43 !important;
          }
        }
        
        span.point-history-text {
          color: ${$TEXT_GRAY};
          
          &.on {
            color: ${$POINT_BLUE};
          }
        }
      }

      a {
        display: inline-block;
        vertical-align: middle;
        padding-left: 5px;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY
        })};
        
        img {
          display: inline-block;
          vertical-align: middle;
          width: 12px;
        }
      }

      strong.price {
        position: absolute;
        right: 0;
        top: 17px;
        ${fontStyleMixin({
          size: 21,
          weight: '300',
          family: 'Montserrat'
        })};

        @media screen and (max-width: 680px) {
          right: 15px;
        }
        
        &.charge, &.given, &.withdrawal {
        border-color: ${$POINT_BLUE} !important;
        color: ${$POINT_BLUE} !important;
        }
      
        &.spent {
          border-color: #f32b43 !important;
          color: #f32b43 !important;
        }
      }
    }
  }

  .no-content {
    padding: 75px 0 20px;

    img {
      width: 115px;
    }
  }
`;

export default PointHistoryTabArea;

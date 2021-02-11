import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../../../../styles/variables.types';

const PointHistoryTabArea = styled.div`
  padding-bottom: 295px;
  
  & > p {
    padding: 19px 0;
    font-size: 14px;
    text-align: center;
    background-color: #f5f7f9;
    
    span {
      color: ${$POINT_BLUE};
    }
  }

  .point-tab-details {
    padding: 15px 0 0;
    li {
      position: relative;
      display: inline-block;
      margin: 0 15px;
      letter-spacing: -0.2px;
      cursor: pointer;
      ${fontStyleMixin({
        size: 16,
        color: $TEXT_GRAY,
        weight: '600'
      })}

      &:first-child {
        margin-left: 0;
      }

      & + li::before {
        content: '';
        position: absolute;
        top: 8px;
        left: -15px;
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
    padding: 20px 0 9px;
    border-bottom: 1px solid ${$FONT_COLOR};
  
    li {
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
      cursor: pointer;
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
    }
  }
  
  .infinite-scroll {
    padding-top: 0;
  }
  
  .charge, .given {
    border-color: ${$POINT_BLUE} !important;
    color: ${$POINT_BLUE} !important;
  }
  
  .spent, .withdrawal {
    border-color: #f32b43 !important;
    color: #f32b43 !important;
  }

  .no-content {
    padding: 75px 0 20px;

    img {
      width: 115px;
    }
  }
`;

export default PointHistoryTabArea;

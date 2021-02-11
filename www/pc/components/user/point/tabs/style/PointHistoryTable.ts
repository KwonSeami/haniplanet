import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $TEXT_GRAY, $POINT_BLUE} from '../../../../../styles/variables.types';

const PointHistoryTable = styled.table`
  table-layout: fixed;

  tr {
    height: 60px;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  th {
    padding-bottom: 4px;
    text-align: left;
  }

  td {
    position: relative;
    padding-top: 5px;
    font-size: 16px;
    
    &.charge, &.given, &.withdrawal {
    border-color: ${$POINT_BLUE} !important;
    color: ${$POINT_BLUE} !important;
    }
  
    &.spent {
      border-color: #f32b43 !important;
      color: #f32b43 !important;
    }

    p {
      position: relative;
      display: inline-block;
      padding-left: 30px;
      max-width: 417px;
      box-sizing: border-box;
    }

    span.point-type {
      position: absolute;
      left: 1px;
      top: 50%;
      margin-top: -8px;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold'
      })}
    
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

    a {
      display: inline-block;
      vertical-align: middle;
      margin-top: -14px;
      padding-left: 5px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}

      img {
        width: 12px;
        display: inline-block;
        vertical-align: middle;
        margin-top: -2px;
      }
    }

    &.price {
      padding: 0;
      text-align: right;
      ${fontStyleMixin({
        size: 21,
        weight: '300',
        family: 'Montserrat'
      })}
    }
  }
`;

export default PointHistoryTable;

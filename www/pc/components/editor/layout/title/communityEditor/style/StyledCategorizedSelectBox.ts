import styled from 'styled-components';
import CategorizedSelectBox from '../../../../../inputs/CategorizedSelectBox';
import {TCommunityUserType} from '../../../../../../src/reducers/categories';
import {TYPE_GRADIENT} from '../../../../../community/common';
import {$BORDER_COLOR} from '../../../../../../styles/variables.types';

const StyledCategorizedSelectBox = styled(CategorizedSelectBox)<{user_type: TCommunityUserType}>`
  border-bottom: 0;
  display: inline-block;
  height: 42px;
  width: 170px;
  position: relative;
  
  p {
    font-size: 15px;
    position: relative;
    text-decoration: underline;
    
    img {
      margin-left: 8px;
      right: auto;
    }
  }
  
  ul {
    left: -2px;
    margin-top: 0;
    max-height: 410px;
    
    li.selectbox-category {
      border: none;
      color: #fff;
      height: 30px;
      font-size: 12px;
      font-weight: 700;
      line-height: 18px;
      margin-top: -1px;
      padding: 6px 0;
      text-align: center;
      background: ${({user_type}) => TYPE_GRADIENT[user_type]};
    }

    li {
      background-color: #fff;
      border-top-width: 0;
      box-sizing: border-box;
      margin-top: 0px;
      overflow: hidden;
      padding: 0 21px 0 14px;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:first-child {
        border-top: 1px solid ${$BORDER_COLOR};
      }
    }
  }

  &::-ms-expand {
    display: none;
  }
`;

export default StyledCategorizedSelectBox;
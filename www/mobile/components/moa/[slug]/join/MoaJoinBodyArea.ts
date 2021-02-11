import styled from 'styled-components';
import PageCenterSection from '../../../common/PageCenterSection';
import {fontStyleMixin, heightMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $TEXT_GRAY} from '../../../../styles/variables.types';

const MoaJoinBodyArea = styled(PageCenterSection)`
  p.moa-type-desc {
    text-align: left;
    width: 100%;
    color: ${$GRAY};
    padding-left: 21px;
    box-sizing: border-box;
    background-color: #f8f6ee;
    border-top: 1px solid ${$BORDER_COLOR};
    ${heightMixin(42)}
    ${fontStyleMixin({size: 14, color: '#999'})};
  
    @media screen and (max-width: 680px) {
      padding-left: 15px;
    }
  }
  
  ul.apply-form {
    border-bottom: 1px solid ${$BORDER_COLOR};
  }
  
  li.responsive-li {
    border-top: 1px solid ${$BORDER_COLOR};
    padding: 16px 23px 30px;
  
    & > h3.title {
      position: static;
      letter-spacing: -2px;
      padding-bottom: 19px;
      ${fontStyleMixin({size: 18, weight: '300'})};
    }
  
    & > div {
      padding:0;
    }
    
    span.title {
      display: inline-block;
      margin-top: -3px;
      padding-right: 2px;
      vertical-align: middle;
      ${fontStyleMixin({size: 11, weight: 'bold'})};
    }
    
    textarea {
      border: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;
      margin: 8px 0 12px;
      padding: 8px 12px;
      width: 100%;
      height: 180px;
      ${fontStyleMixin({size: 14, color: $TEXT_GRAY})};
    
      &::placeholder {
        color: ${$TEXT_GRAY};
      }
    }
    
    li.join-question {
      padding-top: 10px;
    
      textarea {
        height: 80px;
      }
    
      h3 {
        font-size: 14px;
      }
    }
    
    li.applicant-list {
      display: inline-block;
      vertical-align: middle;
      padding-right: 21px;
      ${fontStyleMixin({size: 16, color: $TEXT_GRAY})};
    }
    
    li.nick-name-list {
      position: relative;
      padding-top: 22px;
    
      span.title {
        display: block;
      }
    
      input.input {
        display: inline-block !important;
        vertical-align: middle;
        width: calc(100% - 121px);
        margin-right: 8px;
        height: 44px;
        border-bottom: 1px solid ${$BORDER_COLOR} !important;
        ${fontStyleMixin({size: 14, color: $TEXT_GRAY})};
      }
      
      span.message {
        display: block;
        padding-top: 5px;
        ${fontStyleMixin({size: 11, color: $TEXT_GRAY})};
      }
    }
  }
  
  @media screen and (max-width: 680px) {
    li.responsive-li {
      padding: 16px 15px 30px;
  
      &:last-child {
        padding-bottom: 16px;
      }
    }
  }
`;

export default MoaJoinBodyArea;

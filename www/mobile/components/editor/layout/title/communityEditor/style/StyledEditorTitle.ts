import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from '../../../../../../styles/variables.types';

const StyledEditorTitle = styled.div`
  position: relative;
  padding: 19px 30px 21px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  
  .select-box {
    height: 24px;
    margin-bottom: 10px;
    
    p {
      display: inline-block;
      font-size: 16px;
      height: inherit;
      line-height: 24px;
      text-decoration: none;

      &::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 0;
        width: 100%;
        border-bottom: 1px solid ${$FONT_COLOR};
      }
    }

    ul {
      left: 0;
      margin-top: 10px;
    }
  }
  
  .title-input {
    height: 60px;
    width: 100%;
    margin-bottom: 27px;
    line-height: 30px;
    letter-spacing: -0.2px;
    border-width: 0;
    box-sizing: border-box;
    overflow: hidden;
    ${fontStyleMixin({size: 21, weight: '300'})};
    
    &::placeholder {
      color: ${$TEXT_GRAY};
    }
  }
`;

export default StyledEditorTitle;

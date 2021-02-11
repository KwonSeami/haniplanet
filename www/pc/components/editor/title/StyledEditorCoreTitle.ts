import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../styles/variables.types';

const StyledEditorCoreTitle = styled.div`
  padding: 0 30px;

  .title-input {
    width: 100%;
    height: 40px;
    border-width: 0;
    box-sizing: border-box;
    ${fontStyleMixin({size: 21, weight: '300'})};

    &::placeholder {
      color: ${$TEXT_GRAY};
    }
  }

  .user-option-box {
    display: inline-block;
    margin-left: 8px;

    li {
      display: inline-block;

      & + li {
        margin-left: 14px;
      }
    }
  }
`;

export default StyledEditorCoreTitle;
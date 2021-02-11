import styled from 'styled-components';
import {$BORDER_COLOR, $WHITE} from '../../../../styles/variables.types';
import {radiusMixin} from '../../../../styles/mixins.styles';

const ClearButtonGroupDiv = styled.div`
  position: absolute;
  min-width: 240px;
  min-height: 100px;
  z-index: 2;
  padding: 12px 15px;
  margin-top: 12px;
  ${radiusMixin('7px', $BORDER_COLOR)};
  background-color: ${$WHITE};
  box-shadow: 1px 2px 7px 0 rgba(0, 0, 0, 0.11);

  ul.buttons {
    position: absolute;
    bottom: 15px;
    right: 15px;
    
    li {
      display: inline-block;
      margin-left: 6px;

      button {
        img {
          width: 15px;
          margin-right: 2px;
          vertical-align: middle;
        }
      }
    }
  }
`;

export default ClearButtonGroupDiv;

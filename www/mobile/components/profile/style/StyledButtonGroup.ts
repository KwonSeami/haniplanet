import styled from 'styled-components';
import ButtonGroup from '../../inputs/ButtonGroup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $THIN_GRAY} from '../../../styles/variables.types';

const StyledButtonGroup = styled(ButtonGroup)`
  border-top: 1px solid ${$BORDER_COLOR};
  padding: 30px 0 100px;
  width: 680px;
  margin: auto;
  text-align: center;

  li {
    margin: 0 7.5px;
  }

  button {
    width: 138px;
    height: 39px;
    border-radius: 20px;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({size: 15, color: '#999'})}

    &.right-button {
      border-color: ${$POINT_BLUE};
      color: ${$POINT_BLUE};
    }
  }
`;

export default StyledButtonGroup;

import styled from 'styled-components';
import ButtonGroup from '.';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE, $THIN_GRAY} from '../../../styles/variables.types';

const BasicButtonGroup = styled(ButtonGroup)`
  width: 100%;
  margin: auto;
  text-align: center;
  padding: 30px 0 100px;

  li {
    padding: 0 7.5px;
  }

  button {
    width: 138px;
    height: 40px;
    box-sizing: border-box;
    border-radius: 20px;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({size: 15, color: '#999'})};

    &.right-button {
      color: ${$POINT_BLUE};
      border-color: ${$POINT_BLUE};
    }
  }
`;

export default BasicButtonGroup;

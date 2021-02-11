import styled from 'styled-components';
import ButtonGroup from '../../../../inputs/ButtonGroup';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $THIN_GRAY} from '../../../../../styles/variables.types';

const PointTabConfirmButton = styled(ButtonGroup)`
  padding: 30px 0 100px;
  border-top: 1px solid ${$BORDER_COLOR};

  li {
    padding: 0 5px;
  }

  button {
    width: 128px;
    height: 33px;
    border: 1px solid ${$THIN_GRAY};
    border-radius: 17px;
    ${fontStyleMixin({
      size: 15,
      color: '#999'
    })}

    &.right-button {
      border-color: ${$POINT_BLUE};
      color: ${$POINT_BLUE};
    }
  }
`;

export default PointTabConfirmButton;

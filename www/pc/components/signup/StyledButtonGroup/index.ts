
import styled from 'styled-components';
import ButtonGroup from '../../../components/inputs/ButtonGroup';
import {$THIN_GRAY, $BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';

const StyledButtonGroup = styled(ButtonGroup)`
  margin-top: 28px;
  padding-top: 30px;
  text-align: right;
  border-top: 1px solid ${$BORDER_COLOR};

  li {
    padding-left: 15px;
    display: inline-block;
    vertical-align: middle;
  }

  button {
    width: 140px;
    height: 40px;
    ${fontStyleMixin({
      size: 15,
      color: '#999'
    })}
    border: 1px solid ${$THIN_GRAY};
    border-radius: 20px;

    &.right-button {
      color: ${$POINT_BLUE};
      border-color: ${$POINT_BLUE};
    }

    &:hover,
    &:active {
      opacity: 0.5;
    }
  }
`;

export default StyledButtonGroup;

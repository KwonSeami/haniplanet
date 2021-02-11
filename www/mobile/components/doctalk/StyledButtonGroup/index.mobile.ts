import styled from 'styled-components';
import ButtonGroup from '../../../components/inputs/ButtonGroup';
import {$THIN_GRAY, $POINT_BLUE} from '../../../styles/variables.types';
import {heightMixin, fontStyleMixin} from '../../../styles/mixins.styles';

const StyledButtonGroup = styled(ButtonGroup)`
  text-align: center;
  padding: 30px 0 100px;

  li {
    padding: 0 5px;
  }

  button {
    width: 128px;
    ${heightMixin(33)};
    border: 1px solid ${$THIN_GRAY};
    border-radius: 17px;
    ${fontStyleMixin({
      size: 15,
      color: $THIN_GRAY
    })}

    &.right-button {
      border-color: ${$POINT_BLUE};
      color: ${$POINT_BLUE};
    }
  }

  @media screen and (max-width: 680px) {
    padding-bottom: 80px;
  }

  @media screen and (max-width: 680px) {
    padding-bottom: 110px;
  }
`;

export default StyledButtonGroup;
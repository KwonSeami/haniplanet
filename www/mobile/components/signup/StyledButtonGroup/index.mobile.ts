import styled from 'styled-components';
import ButtonGroup from '../../../components/inputs/ButtonGroup';
import {$THIN_GRAY, $BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import {heightMixin, fontStyleMixin} from '../../../styles/mixins.styles';

const StyledButtonGroup = styled(ButtonGroup)`
  text-align: center;
  margin-top: 30px;
  padding: 30px 0 100px;
  border-top: 1px solid ${$BORDER_COLOR};

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
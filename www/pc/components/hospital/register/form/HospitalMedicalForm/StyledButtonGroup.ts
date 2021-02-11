import styled from "styled-components";
import ButtonGroup from "../../../../inputs/ButtonGroup";
import {fontStyleMixin, heightMixin} from "../../../../../styles/mixins.styles";
import {$TEXT_GRAY, $WHITE} from "../../../../../styles/variables.types";

const StyledButtonGroup = styled(ButtonGroup)`
  margin: 40px 0 56px 0;

  li {
    margin: 0 4px;

    button {
      width: 320px;
      ${heightMixin(54)};
      border-radius: 0;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 16,
        color: '#999'
      })};

      &.left-button {
        border: 1px solid ${$TEXT_GRAY};
      }

      &.right-button {
        background-color: #499aff;
        color: ${$WHITE};
      }
    }
  }
`;

export default StyledButtonGroup;
import styled from "styled-components";
import ButtonGroup from "../../inputs/ButtonGroup";
import {fontStyleMixin} from "../../../styles/mixins.styles";
import {$WHITE} from "../../../styles/variables.types";

const HospitalButtonGroup = styled(ButtonGroup)`
  li {
    width: 50%;
  }

  button {
    width: 100%;
    height: 44px;
    border-radius: 0;
    ${fontStyleMixin({
      size: 15,
      color: '#999'
    })};

    &.right-button {
      background-color: #499aff;
      color: ${$WHITE};
    }
  }
`;

export default HospitalButtonGroup;

import styled from "styled-components";
import CheckBox from '../../../components/UI/Checkbox1/CheckBox';

const LoginCheckBox = styled(CheckBox)`
  label {
    padding-left: 25px;

    &::before {
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;

export default LoginCheckBox;
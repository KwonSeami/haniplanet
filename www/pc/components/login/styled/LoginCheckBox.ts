import styled from 'styled-components';
import Checkbox from '../../UI/Checkbox1/CheckBox';

const LoginCheckBox = styled(Checkbox)`
  label {
    padding-left: 24px;

    &::before {
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;

export default LoginCheckBox;

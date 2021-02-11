import styled from 'styled-components';
import Input from '../../inputs/Input';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';

const HospitalInput = styled(Input)`
  width: 100%;
  height: 44px;
  font-size: 15px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;

  &.address-search {
    display: inline-block;
    vertical-align: bottom;
    margin-right: 6px;
    width: calc(100% - 86px);
  }

  &::placeholder {
    color: ${$TEXT_GRAY};
  }
`;

export default HospitalInput;

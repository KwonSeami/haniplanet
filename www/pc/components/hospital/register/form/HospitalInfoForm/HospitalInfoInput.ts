import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../../../../styles/variables.types';

const HospitalInfoInput = styled.input`
  width: 100%;
  height: 45px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  ${fontStyleMixin({size: 15})};

  &.hospital-name {
    height: 54px;
    ${fontStyleMixin({size: 30, weight:'300'})};
  }

  &.address-search {
    display: inline-block;
    vertical-align: bottom;
    margin-right: 8px;
    width: calc(100% - 74px);
  }
`;

export default HospitalInfoInput;
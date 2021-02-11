import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';

const HospitalH2 = styled.h2`
  width: 680px;
  margin: auto;
  padding: 23px 0 15px;
  ${fontStyleMixin({size: 19, weight: '300'})}
`;

export default HospitalH2;
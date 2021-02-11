import {fontStyleMixin} from '../../../styles/mixins.styles';
import styled from 'styled-components';
import TermPC, {H2, Div} from './TermPC';

const TermMobile = styled(TermPC)`
  ${H2} {
    padding-top: 15px;
    ${fontStyleMixin({
      size: 17,
      weight: 'bold'
    })};
  }

  ${Div} {
    height: 160px;
    margin-top: 17px;
  }
  

  @media screen and (max-width: 680px) {
    padding: 0 15px;
  }
`;

TermMobile.displayName = 'TermMobile';
export default TermMobile;
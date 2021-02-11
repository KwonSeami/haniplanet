import styled from 'styled-components';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';

const SecessionDiv = styled.div`
  position: relative;
  width: 680px;
  margin: auto;
  border-top: 1px solid ${$BORDER_COLOR};
  padding: 20px 0 35px 102px;
  box-sizing: border-box;

  h2 {
    position: absolute;
    left: 0;
    top: 33px;
    ${fontStyleMixin({size: 11, weight: 'bold'})}

    span {
      display: block;
      padding: 0;
    }
  }
`;

export default SecessionDiv;
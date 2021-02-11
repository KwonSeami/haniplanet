import styled from 'styled-components';
import PointCalculatorArea from '../tabs/PointCharge/PointCalculatorArea';
import {$BORDER_COLOR} from '../../../../styles/variables.types';

const UserPointListArea = styled.div`
  border-top: 1px solid ${$BORDER_COLOR};

  > div {
    width: 680px;
    margin: 0 auto;
  }
  
  ${PointCalculatorArea} {
    padding: 15px 0 3px;
    
    h3 {
      padding-bottom: 18px;
    }
  }
`;

export default UserPointListArea;

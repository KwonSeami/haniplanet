import styled from 'styled-components';
import PointCharge from '../PointCharge';
import {PaymentButton} from '../../../../layout/popup/PointChargePopup';

const PointChargeTabArea = styled(PointCharge)`
  padding: 9px 0 0;
  height: 100%;
  overflow-y: unset;
  
  .my-point {
    display: none;
  }

  .charge-point {
    padding: 11px 0 15px;
    
    & > p {
      padding-bottom: 8px;
    }
  } 

  .charge-guide {
    padding-bottom: 22px;
  }

  .charge-agree {
    padding-bottom: 42px;
  }

  ${PaymentButton} {
    top: -1px;
  }

  @media screen and (max-width: 680px) {
    .charge-point {
      padding: 11px 15px 15px;
    }
  }
`;

export default PointChargeTabArea;

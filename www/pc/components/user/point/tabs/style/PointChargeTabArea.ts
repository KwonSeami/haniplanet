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
    & > p {
      padding-bottom: 8px;
    }

    .point-menu {
      padding-bottom: 33px;

      li {
        padding: 14px 20px 12px;
      }
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
`;

export default PointChargeTabArea;

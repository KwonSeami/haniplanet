import * as React from 'react';
import styled from 'styled-components';
import {PopupProps} from '../../common/popup/base/Popup';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import Alert from '../../common/popup/Alert';

const StyledAlert = styled(Alert)`
  ${TitleDiv} {
    padding: 0;
    border: 0;
  }

  .popup-child {
    font-size: 17px;
    line-height: 28px;
    text-align: center;
    white-space: pre-wrap;
    padding: 65px 25px 16px;
  }
  
  .button {
    margin-bottom: 30px;
  }
`;

const OnClassApplyPopup: React.FC<PopupProps> = (
  ({id, closePop}) => (
    <StyledAlert
      id={id}
      closePop={closePop}
    >
      한의플래닛 온라인강사 신청은<br/>
      '한의사'유형만 가능합니다.
    </StyledAlert>
  )
);

export default React.memo(OnClassApplyPopup);

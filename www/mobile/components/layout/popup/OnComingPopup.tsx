import * as React from 'react'
import Alert from "../../common/popup/Alert";
import {PopupProps} from '../../common/popup/base/Popup';
import styled from 'styled-components';
import {TitleDiv} from '../../common/popup/base/TitlePopup';

const StyledPopup = styled(Alert)`
  
  ${TitleDiv} {
    padding: 0;
    border: 0;
  }

  .popup-child {
    font-size: 17px;
    line-height: 28px;
    text-align: center;
    padding: 65px 25px 16px;
  }
  
  .button {
    margin-bottom: 30px;
  }
`;

interface IOnComingPopupProps extends PopupProps{
  oncoming_month: number;
}
const OnComingPopup: React.FC<IOnComingPopupProps> = (props) => {
  const {id, closePop, oncoming_month} = props;

  return (
    <StyledPopup
      id={id}
      closePop={closePop}
    >
      해당 강의는 {oncoming_month}월 중 오픈 예정입니다.<br />조금만 기다려주세요.
    </StyledPopup>
  );
};


export default React.memo(OnComingPopup);
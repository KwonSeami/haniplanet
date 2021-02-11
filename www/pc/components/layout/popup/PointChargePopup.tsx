import * as React from 'react';
import styled from 'styled-components';
import Button from '../../inputs/Button';
import ButtonGroup from '../../inputs/ButtonGroup';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import PointCharge from '../../user/point/tabs/PointCharge';
import Confirm, {StyledButtonGroup} from '../../common/popup/Confirm';
import {PopupProps} from '../../common/popup/base/Popup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import {$FONT_COLOR, $BORDER_COLOR, $WHITE} from '../../../styles/variables.types';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 680px;

    ${TitleDiv} h2 {
      position: relative;
      padding: 8px 0 8px 43px;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold'
      })}

      &::after {
        content: '';
        position: absolute;
        top: 15px;
        left: 25px;
        width: 11px;
        height: 5px;
        background-color: ${$FONT_COLOR};
      }
    }

    ${Close} {
      right: 12px;
      top: 15px;
    }
  }

  ${StyledButtonGroup} {
    padding: 30px 0 35px;
    border-top: 1px solid ${$BORDER_COLOR};
  }
`;

export const PaymentButtonGroup = styled(ButtonGroup)`
  li {
    //width: calc(50% - 2px);
    //
    //&:first-child {
    //  padding-right: 4px;
    //}
    width: 100%;
    
    &:first-child {
      display: none;
    }
  }

  button {
    width: 100%;
    height: 45px;
    box-sizing: border-box;
    background-color: ${$FONT_COLOR};
    ${fontStyleMixin({
      size: 16,
      color: $WHITE
    })}
    border-radius: 0;

    &.right-button {
      background-color: #fcea0f;
      color: ${$FONT_COLOR};
    }

    img {
      display: inline-block;
      vertical-align: middle;
      width: 18px;
      margin: -2px 2px 0 0;
    }
  }
`;

export const PaymentCheckBox = styled(CheckBox)`
  label {
    padding-left: 23px;

    &::before {
      left: 0;
    }
  }
`;

export const PaymentButton = styled(Button)`
  position: absolute;
  left: 265px;
  top: 3px;

  img {
    width: 5px;
    transform: rotate(90deg);
  }

  &:hover {
    background-color: #f6f7f9;
  }

  &.on img {
    transform: rotate(-90deg);
  }
`;

const PointChargePopup = React.memo<PopupProps>(
  ({id, closePop}) => {
    const pointChargeRef = React.useRef(null);

    return (
      <StyledConfirm
        id={id}
        closePop={closePop}
        notClosePop
        title="별 충전하기"
        buttonGroupProps={{
          leftButton: {
            onClick: () => closePop(id),
          },
          rightButton: {
            onClick: () => {
              pointChargeRef.current.handleClickChargeButton();
            },
          },
        }}
      >
        <PointCharge ref={pointChargeRef} />
      </StyledConfirm>
    );
  }
);

PointChargePopup.displayName = 'PointChargePopup';
export default PointChargePopup;

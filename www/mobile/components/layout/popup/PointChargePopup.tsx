import * as React from 'react';
import styled from 'styled-components';
import Button from '../../inputs/Button';
import ButtonGroup from '../../inputs/ButtonGroup';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import PointCharge from '../../user/point/tabs/PointCharge';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $BORDER_COLOR, $POINT_BLUE, $WHITE, $THIN_GRAY} from '../../../styles/variables.types';
import FakeFullPopup from '../../common/popup/base/FakeFullPopup';
import {PopupProps} from '../../common/popup/base/Popup';

export const PaymentButtonGroup = styled(ButtonGroup)`
  li {
  //  width: calc(50% - 2px);
  //
  //  &:first-child {
  //    padding-right: 4px;
  //  }
    width: 100%;
    
    &:first-child {
      display: none;
    }
  }

  button {
    width: 100%;
    height: 45px;
    border-radius: 0;
    box-sizing: border-box;
    background-color: ${$FONT_COLOR};
    ${fontStyleMixin({size: 16, color: $WHITE})};

    &.right-button {
      background-color: #fcea0f;
      color: ${$FONT_COLOR};
    }

    img {
      width: 18px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 2px 0 0;
    }
  }
`;

export const PaymentCheckBox = styled(CheckBox)`
  display: inline-block;
  vertical-align: middle;

  label {
    padding-left: 23px;

    &::before {
      width: 15px;
      height: 15px;
      top: 3px;
    }
  }
`;

export const PaymentButton = styled(Button)`
  vertical-align: middle;
  margin-left: 6px;

  img {
    width: 5px;
    transform: rotate(90deg);
  }

  &.on img {
    transform: rotate(-90deg);
  }
`;

const PointPaymentButtonGroup = styled(ButtonGroup)`
  padding: 30px 0 100px;
  border-top: 1px solid ${$BORDER_COLOR};

  li {
    padding: 0 6px;
  }

  button {
    width: 128px;
    height: 33px;
    border-radius: 17px;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({size: 15, color: '#999'})};

    &.right-button {
      color: ${$POINT_BLUE};
      border-color: ${$POINT_BLUE};
    }
  }
`;

const PointChargePopup = React.memo<PopupProps>(props => {
  const {id, closePop} = props;
  const pointChargeRef = React.useRef(null);

  return (
    <FakeFullPopup
      id={id}
      closePop={closePop}
    >
      <div>
        <PointCharge ref={pointChargeRef} />
        <PointPaymentButtonGroup
          leftButton={{children: '취소', onClick: () => closePop(id)}}
          rightButton={{
            children: '확인',
            onClick: () => {
              pointChargeRef.current.handleClickChargeButton({
                succClbck: (point) => {
                  closePop(id);
                },
              });
            },
          }}
        />
      </div>
    </FakeFullPopup>
  );
});

PointChargePopup.displayName = 'PointChargePopup';
export default PointChargePopup;

import * as React from 'react';
import styled from 'styled-components';
import ButtonGroup, {IButtonGroupProps} from '../../inputs/ButtonGroup';
import TitlePopup from './base/TitlePopup';
import {ButtonProps} from '../../inputs/Button';
import {PopupProps} from './base/Popup';
import {heightMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE} from '../../../styles/variables.types';

interface Props extends PopupProps {
  className?: string;
  title?: React.ReactNode;
  isBtnShow?: boolean;
  buttonGroupProps?: IButtonGroupProps;
  notClosePop?: boolean;
  children?: React.ReactNode;
  callback?: () => void;
  leftCallback?: () => void;
  rightCallback?: () => void;
}

const StyledTitlePopup = styled(TitlePopup)``;

export const StyledButtonGroup = styled(ButtonGroup)`
  padding: 30px 0 35px;

  li {
    padding: 0 5px;
  }

  button {
    width: 128px;
    ${heightMixin(33)};
    border-radius: 17px;
    text-align: center;
    box-sizing: border-box;
    font-size: 15px;
    color: #999;
    border: 1px solid #999;

    &.right-button {
      border-color: ${$POINT_BLUE};
      color: ${$POINT_BLUE};
    }
  }
`;

const Confirm = React.forwardRef<any, Props>(({
  id,
  className,
  children,
  title,
  isBtnShow = true,
  buttonGroupProps,
  notClosePop,
  closePop,
  closeCallback,
  callback,
}, ref) => {
  const {leftButton = {}, rightButton = {}} = buttonGroupProps || {} as any as IButtonGroupProps;

  const handleClickButton = React.useCallback((e) => {
    const {onClick} = rightButton || {} as any as ButtonProps;

    onClick(e);
    !notClosePop && closePop(id);
  }, [notClosePop, rightButton.onClick, closePop, id]);

  const handleClickCancleButton = React.useCallback((e) => {
    const {onClick} = leftButton || {} as any as ButtonProps;

    !notClosePop && closePop(id);
    onClick && onClick(e);
  }, [notClosePop, leftButton.onClick, closePop, id]);

  return (
    <StyledTitlePopup
      id={id}
      ref={ref}
      closePop={closePop}
      className={className}
      callback={callback}
      title={title}
      content={children}
      closeCallback={closeCallback}
    >
      {isBtnShow && (
        <StyledButtonGroup
          leftButton={{
            ...leftButton,
            onClick: handleClickCancleButton,
            children: leftButton.children || '취소',
          }}
          rightButton={{
            ...rightButton,
            onClick: handleClickButton,
            children: rightButton.children || '확인',
          }}
        />
      )}
    </StyledTitlePopup>
  );
});

export default React.memo<Props>(Confirm);

import * as React from 'react';
import styled from 'styled-components';
import Button from '../../inputs/Button';
import {ButtonProps} from '../../inputs/Button';
import TitlePopup from './base/TitlePopup';
import {PopupProps} from './base/Popup';
import {$POINT_BLUE} from '../../../styles/variables.types';

interface Props extends PopupProps {
  className?: string;
  title?: React.ReactNode;
  buttonText?: string;
  buttonProps?: ButtonProps;
  callback?: () => void;
  isButtonShow?: boolean;
}

const StyledTitlePopup = styled(TitlePopup)``;

export const StyledButton = styled(Button)`
  display: block;
  margin: 20px auto 25px;
`;

const Alert = React.forwardRef<any, Props>((props, ref) => {
  const {id, className, children, title, isButtonShow = true, buttonText, callback, buttonProps = {}, closePop} = props;
  const handleClickButton = React.useCallback((e) => {
    const {onClick} = buttonProps;

    closePop(id);
    onClick && onClick(e);
  }, [buttonProps.onClick], closePop, id);

  return (
    <StyledTitlePopup
      id={id}
      ref={ref}
      title={title}
      content={children}
      callback={callback}
      closePop={closePop}
      className={className}
    >
      {isButtonShow && (
        <StyledButton
          {...buttonProps}
          onClick={handleClickButton}
          size={{width: '128px', height: '33px'}}
          font={{size: '15px', color: $POINT_BLUE}}
          border={{radius: '17px', width: '1px', color: $POINT_BLUE}}
        >
          {buttonText || '확인'}
        </StyledButton>
      )}
    </StyledTitlePopup>
  );
});

export default React.memo<Props>(Alert);

import * as React from 'react';
import styled from 'styled-components';
import Popup, {PopupProps} from './Popup';
import {$BORDER_COLOR} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';

interface Props extends PopupProps {
  title?: React.ReactNode;
  className?: string;
  callback?: () => void;
  closeCallback?: () => void;
  content?: React.ReactNode;
}

interface IStyledPopupProps {
  strContent: boolean;
}

const StyledPopup = styled(Popup)<IStyledPopupProps>`
  .modal-body {
    box-sizing: border-box;
    min-width: 320px;
    border-radius: 8px;
  }
`;

export const TitleDiv = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 15px 45px 13px 0; /* TODO: Close버튼 겹쳐지는 부분때문에 padding-right가 필요하여 추가 */
  border-bottom: 1px solid ${$BORDER_COLOR};
`;

export const Close = styled.span`
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 10;
  

  img {
    width: 30px;
  }
`;

const TitlePopup = React.forwardRef<any, Props>((props, ref) => {
  const {id, title, className, closePop, callback, closeCallback, children, content} = props;
  const isContentStr = React.useMemo(() => typeof content === 'string', [content]);

  return (
    <StyledPopup
      id={id}
      className={className}
      afterClose={callback}
      strContent={isContentStr}
      ref={ref}
      isOpen
    >
      <TitleDiv className="popup-title">
        {title && <h2>{title}</h2>}
        <Close
          onClick={() => {
            closeCallback && closeCallback();
            closePop(id);
          }}
        >
          <img
            src={staticUrl('/static/images/icon/icon-close.png')}
            alt="닫기"
          />
        </Close>
      </TitleDiv>
      {content && (
        <div className="popup-child">{content}</div>
      )}
      {children}
    </StyledPopup>
  );
});

export default React.memo<Props>(TitlePopup);

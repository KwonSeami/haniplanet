import * as React from 'react';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import {$WHITE} from '../../../../styles/variables.types';
import {popPopup} from '../../../../src/reducers/popup';

interface Props {
  id: string;
  className?: string;
  full?: boolean;
  isOpen: boolean;
  afterClose?: () => void;
}

export interface PopupProps {
  id: string;
  closePop: typeof popPopup;
}

interface IModalPopupDivProps {
  isOpen: boolean;
  full: boolean;
}

const ModalPopupDiv = styled.div<IModalPopupDivProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 20000;
  opacity: 0;
  visibility: hidden;

  .modal-body {
    position: absolute;
    background-color: ${$WHITE};
    z-index: 1;
  }

  ${({isOpen}) => isOpen && `
    opacity: 1;
    visibility: visible;
  `}

  ${({full}) => full && `
    // 풀스크린 팝업에선 z-index가 헤더보다 낮아야함. ex:에디터
    z-index: 2000;
        
    .modal-body {
      width:100%;
      height:100%;
      position: relative;
      box-sizing: border-box;
      overflow-y: scroll;
      padding-top: 120px;
      background-color: #f6f7f9;
    }
  `}
`;

interface IBodyStyle {
  top: string | number;
  left: string | number;
}

const Popup = React.forwardRef<any, Props>((props, ref) => {
  const {id, isOpen, children, className, full = false, afterClose = () => null} = props;

  const [bodyStyle, setBodyStyle] = React.useState<IBodyStyle>({top: '50%', left: '50%'});
  const modalWrapper_ = React.useRef<HTMLDivElement>();
  const modalBody_ = React.useRef<HTMLDivElement>();

  const toCenterThrottle = React.useRef<() => void>();

  const _toCenter = React.useCallback(() => {
    try {
      if (isOpen) {
        const {current: modalWrapper} = modalWrapper_;
        const {current: modalBody} = modalBody_;

        const wrapperOffsetHeight = modalWrapper.clientHeight || modalWrapper.offsetHeight;
        const wrapperOffsetWidth = modalWrapper.clientWidth || modalWrapper.offsetWidth;
        const bodyOffsetHeight = modalBody.clientHeight || modalBody.offsetHeight;
        const bodyOffsetWidth = modalBody.clientWidth || modalBody.offsetWidth;
        const top = !full ? `${(wrapperOffsetHeight - bodyOffsetHeight) / 2}px` : 0;
        const left = modalWrapper.offsetWidth > modalBody.offsetWidth
          ? `${(wrapperOffsetWidth - bodyOffsetWidth) / 2}px`
          : 0;

        if (top !== bodyStyle.top || left !== bodyStyle.left) {
          setBodyStyle({top, left});
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [children]);

  React.useImperativeHandle(ref, () => ({
    toCenter() {
      _toCenter();
    }
  }));

  React.useEffect(() => {
    toCenterThrottle.current = throttle(_toCenter, 500);
    window.addEventListener('resize', toCenterThrottle.current);

    return () => {
      afterClose();
      window.removeEventListener('resize', toCenterThrottle.current);
    };
  }, []);

  React.useEffect(() => {
    _toCenter();
  }, [_toCenter]);

  return (
    <ModalPopupDiv
      id={id}
      className={className}
      ref={modalWrapper_}
      isOpen={isOpen}
      full={full}
    >
      <div
        className="modal-body"
        ref={modalBody_}
        style={bodyStyle}
      >
        {children}
      </div>
    </ModalPopupDiv>
  );
});

export default React.memo(Popup);

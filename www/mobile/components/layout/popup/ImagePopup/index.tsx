import React from 'react';
import styled from 'styled-components';
import Popup, {PopupProps} from '../../../common/popup/base/Popup';
import {setNotShowPopups} from './store/lib';
import {$BORDER_COLOR, $WHITE} from '../../../../styles/variables.types';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import Button from '../../../inputs/Button';

interface IStyledPopupProps {
  strContent: boolean;
}

const StyledPopup = styled(Popup)<IStyledPopupProps>`
  .modal-body {
    min-width: 300px;
    border-radius: 4px;
    box-sizing: border-box;
    
    .top-close-btn {
      position: absolute;
      top: -28px;
      right: 0;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
        color: $WHITE
      })};
    }
    
    .content {
      border-radius: 4px 4px 0 0;
      overflow: hidden;
      text-align: center;
      font-size: 0;

      img {
        max-width: 100%;
      }
    }
    
    .event-button {
      height: 50px;
      display: flex;
      
      .button:nth-of-type(2) {
        border-left: 1px solid ${$BORDER_COLOR};
      }
    }
  }
`;

interface Props extends PopupProps {
  className?: string;
  popupId: number;
  html: string;
}

const ImagePopup: React.FC<Props> = ({id, closePop, className, popupId, html}) => {
  const closePopup = React.useCallback(() => closePop(id), [closePop, id]);
  const onClickNotShowBtn = React.useCallback((popupId: number, daily?: boolean) => {
    setNotShowPopups(popupId, daily);
    closePopup();
  }, [closePopup]);

  return (
    <StyledPopup
      id={id}
      className={className}
      isOpen
    >
      <button
        className="pointer top-close-btn"
        onClick={closePopup}
      >
        닫기
      </button>
      <div
        className="content"
        dangerouslySetInnerHTML={{__html: html}}
      />
      <div className="event-button">
        <Button
          size={{
            width: '100%',
            height: '100%'
          }}
          font={{
            size: '15px',
            weight: '600',
          }}
          border={{
            radius: '0'
          }}
          onClick={() => onClickNotShowBtn(popupId, false)}
        >
          더 이상 보지않기
        </Button>
        {/* 버튼 띄우는 조건이 필요합니다.(백엔드 작업이 선행되어야 함)
        <Button
          size={{
            width: '100%',
            height: '100%'
          }}
          font={{
            size: '15px',
            weight: '600',
          }}
          border={{
            radius: '0'
          }}
          onClick={() => onClickNotShowBtn(popupId, true)}
        >
          오늘은 그만 보기
        </Button> */}
      </div>
    </StyledPopup>
  );
};

export default React.memo(ImagePopup);

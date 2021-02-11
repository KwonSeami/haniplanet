import * as React from 'react';
import styled from 'styled-components';
import Alert from '../../common/popup/Alert';
import {PopupProps} from '../../common/popup/base/Popup';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import {staticUrl} from '../../../src/constants/env';
import {$GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';

const StyledAlert = styled(Alert)`
  .modal-body {
    width: 380px;
    height: 223px;
    text-align: center;
    
    ${TitleDiv} {
      padding: 35px 20px 30px; 
      h2 {
        font-size: 21px;
        img {
          display: inline-block;
          vertical-align: middle;
          margin: -2px 4px 0 0;
          width: 18px;
        }
      }
      div {
        padding-top: 13px; 
        p {
          ${fontStyleMixin({
            size: 14,
            color: $GRAY
          })}
        }
      }
    }
    ${Close} {
      right: 11px;
      top: 11px;
    }
  }
`;

const ProfessorEvaluationPopup = React.memo<PopupProps>(
  ({id, closePop}) => (
    <StyledAlert
      id={id}
      closePop={closePop}
      title={
        <>
          <img
              src={staticUrl("/static/images/icon/icon-follow-check.png")}
              alt="교수 평가 완료"
          />
          평가완료
          <div>
            <p>
              평가 완료되었습니다.
            </p>
            <p>
              추후에 평가 항목을 수정 하실 수 있습니다.
            </p>
          </div>
        </>
      }
    >
    </StyledAlert>
  )
);

ProfessorEvaluationPopup.displayName = 'ProfessorEvaluationPopup';
export default ProfessorEvaluationPopup;

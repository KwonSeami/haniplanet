import * as React from 'react';
import {PopupProps} from '../../../../common/popup/base/Popup';
import styled from 'styled-components';
import Alert from '../../../../common/popup/Alert';
import {staticUrl} from '../../../../../src/constants/env';
import {TitleDiv} from '../../../../common/popup/base/TitlePopup';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$POINT_BLUE, $BORDER_COLOR, $GRAY} from '../../../../../styles/variables.types';

const StyledAlert = styled(Alert)`
  .modal-body {
    width: 390px;

    ${TitleDiv} {
      border: 0;
      padding: 21px 45px 20px 22px;

      h2 {
        ${fontStyleMixin({
          size: 19,
          weight: '300'
        })}

        strong {
          display: block;
        }
      }
    } 
  }
`;

const InfoAlert = styled.div`
  padding: 0 22px;
  
  p {
    padding-bottom: 10px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    line-height: 1.5;
    ${fontStyleMixin({
      size: 13,
      color: $GRAY
    })}

    span {
      color: ${$POINT_BLUE};
    }
  }

  ul {
    padding: 34px 0 9px;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  li {
    position: relative;
    padding: 14px 0 14px 61px;
    ${fontStyleMixin({
      size: 12,
      color: $GRAY
    })}

    h3 {
      padding-bottom: 1px;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        color: $GRAY
      })}
    }

    .signup-text {
      position: absolute;
      top: -23px;
      left: 1px;
    }

    img {
      position: absolute;
      left: -1px;
      top: 1px;
      width: 55px;
    }
  }
`;

const InfoPopup: React.FC<PopupProps> = React.memo(
  ({id, closePop, ...props}) => {
    return (
      <StyledAlert
        id={id}
        closePop={closePop}
        title={
          <>
            해외 거주자
            <strong>본인인증 안내</strong>
          </>
        }
        {...props}
      >
        <InfoAlert>
          <p>
            한의플래닛은 휴대폰인증을 통해 본인확인 후, 회원가입이 가능합니다. 해외 거주로 휴대폰인증이 어려우신 경우, 아래 항목을 기재하여 관리자에게 <span>메일(customer@balky.kr)</span>로 보내주시기 바랍니다.
          </p>
          <ul>
            <li>
              <span className="signup-text">※ 회원가입 시 필요한 항목</span>
              <img
                src={staticUrl("/static/images/icon/icon-join-name.png")}
                alt="이름"
              />
              <h3>1.이름</h3>
              한글이름
            </li>
            <li>
              <img
                src={staticUrl("/static/images/icon/icon-join-email.png")}
                alt="이메일주소"
              />
              <h3>2.이메일주소</h3>
              본인확인용 이메일 주소
            </li>
            <li>
              <img
                src={staticUrl("/static/images/icon/icon-join-id.png")}
                alt="아이디"
              />
              <h3>3.아이디</h3>
              5자이상 (영문, 숫자만 가능)
            </li>
            <li>
              <img
                src={staticUrl("/static/images/icon/icon-join-file.png")}
                alt="첨부서류"
              />
              <h3>4.첨부서류</h3>
              여권사본, 면허증사본 <span>(학생의 경우, 학생증 사본첨부)</span>
            </li>
          </ul>
        </InfoAlert>
      </StyledAlert>
    );
  }
);

export default InfoPopup;

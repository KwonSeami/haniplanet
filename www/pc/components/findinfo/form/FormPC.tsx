import * as React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import useForm, {IFormProps} from './useForm';
import useFormHandle from './useFormHandle';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE} from '../../../styles/variables.types';
import ResponsiveLi from '../../UI/ResponsiveLi/ResponsiveLi';
import Input from '../../inputs/Input';
import Button from '../../inputs/Button';

interface IInputProps {
  hasButton?: boolean;
  certification?: boolean;
}

interface IPProps {
  emailMsg?: boolean;
}

const Ul = styled.ul`
  padding: 16px 0 0 188px;
`;

export const StyledResponsiveLi = styled(ResponsiveLi)`
  padding-bottom: 11px;

  h3 {
    top: 15px;
  }
`;

export const StyledInput = styled(Input)<IInputProps>`
  width: 100%;
  height: 44px;
  font-size: 13px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;

  ${props => props.hasButton && `
    width: calc(100% - 145px);
  `}

  ${props => props.certification && `
    padding-right: 130px;
  `}
`;

export const CertificationButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
`;

export const P = styled.p<IPProps>`
  position: absolute;
  right: 7px;
  top: 12px;
  font-size: 12px;

  span {
    color: #ea6060;
  }

  ${props => props.emailMsg && `
    padding-top: 5px;
    position: static;

    span {
      display: block;
    }
  `}
`;

export const Span = styled.span`
  display: block;
  padding-top: 5px;
  ${fontStyleMixin({
    size: 11,
    color: '#ea6060'
  })}
`;

const ConfirmButton = styled(Button)`
  float: right;
`;

const FormPC: React.FC<IFormProps> = React.memo(
  ({send_by, field}) => {
    const {
      IDENTIFIER,
      isSendTypeEmail,
      authTime,
      isVerifyState: {isVerify, setIsVerify}
    } = useForm({send_by, field});
    const {
      onChangeAtName,
      getAuthCode,
      findUserInfo,
      infoState: {info, setInfo},
      userPasswordState: {userPassword, setUserPassword},
      csrfState: {csrf}
    } = useFormHandle({send_by, field});
    const {identifier, send_to, code} = info;
    const {password, password2} = userPassword;
  
    return (
      <>
        <Ul>
          <StyledResponsiveLi title={IDENTIFIER}>
            <StyledInput
              placeholder={`${IDENTIFIER}${IDENTIFIER === '이름' ? '을' : '를'} 입력해주세요.`}
              name="identifier"
              value={identifier}
              onChange={onChangeAtName(setInfo)}
            />
          </StyledResponsiveLi>
          <StyledResponsiveLi title={isSendTypeEmail ? '이메일' : '휴대폰 번호'}>
            <StyledInput
              name="send_to"
              value={send_to}
              placeholder={isSendTypeEmail ? '이메일 주소를 입력해주세요.' : "'-'없이 입력해주세요."}
              onChange={onChangeAtName(setInfo)}
              numberOnly={!isSendTypeEmail}
              hasButton
            />
            <CertificationButton
              border={{ width: '1px', color: $BORDER_COLOR }}
              size={{ width: '138px', height: '44px' }}
              font={{ color: $GRAY, size: '13px' }}
              onClick={() => getAuthCode().then(({status}) => {
                if (Math.floor(status / 100) !== 4) {
                  setIsVerify(true);
                }
              })}
            >
              인증번호 받기
            </CertificationButton>
          </StyledResponsiveLi>
          <StyledResponsiveLi title="인증번호">
            <StyledInput
              name="code"
              value={code}
              placeholder="인증번호 6자리를 입력해주세요."
              onChange={onChangeAtName(setInfo)}
              certification
            />
            {(isVerify && !csrf) &&  (
              isSendTypeEmail ? (
                <P emailMsg>
                  <span>이메일 발송이 완료되었습니다. 확인 후 인증번호를 입력해 주세요.</span>
                  인증번호는 발송 후 1시간 내에만 유효합니다.
                </P>
              ) : (
                <>
                  <P>
                    인증 유효시간: <span>{moment(authTime.timer).format('m분 ss초')}</span>
                  </P>
                  <Span>문자발송이 완료되었습니다. 인증번호를 입력해주세요.</Span>
                </>
              )
            )}
          </StyledResponsiveLi>
          {csrf && (
            <>
              <StyledResponsiveLi title="비밀번호">
                <StyledInput
                  type="password"
                  placeholder="8자이상(영소문자, 숫자 필수)"
                  name="password"
                  value={password}
                  onChange={onChangeAtName(setUserPassword)}
                />
              </StyledResponsiveLi>
              <StyledResponsiveLi title="비밀번호 확인">
                <StyledInput
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요."
                  name="password2"
                  value={password2}
                  onChange={onChangeAtName(setUserPassword)}
                />
              </StyledResponsiveLi>
            </>
          )}
        </Ul>
        <ConfirmButton
          border={{ width: '1px', color: $POINT_BLUE, radius: '20px' }}
          font={{ size: '15px', color: $POINT_BLUE }}
          size={{ width: '140px', height: '39px' }}
          onClick={() => findUserInfo()}
        >
          확인
        </ConfirmButton>
      </>
    );
  }
);

export default FormPC;

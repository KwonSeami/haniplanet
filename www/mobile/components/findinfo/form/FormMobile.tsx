import * as React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import useForm, {IFormProps} from './useForm';
import useFormHandle from './useFormHandle';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE} from '../../../styles/variables.types';
import Input from '../../inputs/Input';
import Button from '../../inputs/Button';
import {useRouter} from "next/router";

interface IInputProps {
  hasButton?: boolean;
  certification?: boolean;
}

interface IPProps {
  emailMsg?: boolean;
}

const FormUl = styled.ul`
  padding-top: 25px;
  
  @media screen and (max-width: 500px) {
    padding-top: 15px;
  }
`;

const FormLi = styled.li`
  position: relative;
  padding-bottom: 11px;
`;

const StyledInput = styled(Input)<IInputProps>`
  width: 100%;
  height: 44px;
  font-size: 13px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  
  ${({hasButton}) => hasButton && `
    width: calc(100% - 148px);

    @media screen and (max-width: 500px) {
      width: calc(100% - 121px);
    }
  `}

  ${({certification}) => certification && `
    padding-right: 130px;
  `}
`;

const CertificationButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;

  @media screen and (max-width: 500px) {
    width: 113px;
  }
`;

const P = styled.p<IPProps>`
  position: absolute;
  right: 7px;
  top: 12px;
  font-size: 11px;

  span {
    color: #ea6060;
  }

  ${({emailMsg}) => emailMsg && `
    padding-top: 5px;
    position: static;

    span {
      display: block;
    }
  `}
`;

const Span = styled.span`
  display: block;
  padding-top: 5px;
  ${fontStyleMixin({
  size: 11,
  color: '#ea6060',
})}
`;

const ConfirmButton = styled(Button)`
  display: block;
  margin: 20px auto auto;
`;

const FormMobile: React.FC<IFormProps> = React.memo(
  ({send_by, field}) => {
    const {
      IDENTIFIER,
      isSendTypeEmail,
      authTime,
      isVerifyState: {isVerify, setIsVerify},
    } = useForm({send_by, field});
    const {
      onChangeAtName,
      getAuthCode,
      findUserInfo,
      infoState: {info, setInfo},
      userPasswordState: {userPassword, setUserPassword},
      csrfState: {csrf},
    } = useFormHandle({send_by, field});
    const {identifier, send_to, code} = info;
    const {password, password2} = userPassword;
    const router=useRouter();

    return (
      <>
        <FormUl>
          <FormLi>
            <StyledInput
              placeholder={`${IDENTIFIER}${IDENTIFIER === '이름' ? '을' : '를'} 입력해주세요.`}
              name="identifier"
              value={identifier}
              onChange={onChangeAtName(setInfo)}
            />
          </FormLi>
          <FormLi>
            <StyledInput
              name="send_to"
              value={send_to}
              placeholder={isSendTypeEmail ? '이메일 주소를 입력해주세요.' : '\'-\'없이 입력해주세요.'}
              onChange={onChangeAtName(setInfo)}
              numberOnly={!isSendTypeEmail}
              hasButton
            />
            <CertificationButton
              border={{width: '1px', color: $BORDER_COLOR}}
              size={{width: '138px', height: '44px'}}
              font={{color: $GRAY, size: '13px'}}
              onClick={() => getAuthCode().then(({status}) => {
                if (Math.floor(status / 100) !== 4) {
                  setIsVerify(true);
                }
              })}
            >
              인증번호 받기
            </CertificationButton>
          </FormLi>
          <FormLi>
            <StyledInput
              name="code"
              value={code}
              placeholder="인증번호 6자리를 입력해주세요."
              onChange={onChangeAtName(setInfo)}
              certification
            />
            {(isVerify && !csrf) && (
              isSendTypeEmail ? (
                <P emailMsg={true}>
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
          </FormLi>
          {csrf && field === 'password' && (
            <>
              <FormLi title="비밀번호">
                <StyledInput
                  type="password"
                  placeholder="8자이상(영소문자, 숫자 필수)"
                  name="password"
                  value={password}
                  onChange={onChangeAtName(setUserPassword)}
                />
              </FormLi>
              <FormLi title="비밀번호 확인">
                <StyledInput
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요."
                  name="password2"
                  value={password2}
                  onChange={onChangeAtName(setUserPassword)}
                />
              </FormLi>
            </>
          )}
        </FormUl>
        <ConfirmButton
          border={{width: '1px', color: $POINT_BLUE, radius: '20px'}}
          font={{size: '15px', color: $POINT_BLUE}}
          size={{width: '128px', height: '33px'}}
          onClick={() => {
            const findUserInfoRes = findUserInfo();
            findUserInfoRes && findUserInfoRes.then(() => {
              if (field === 'password' && !csrf) {
                return null;
              }
              router.replace('/');
            });
          }}
        >
          확인
        </ConfirmButton>
      </>
    );
  },
);

export default FormMobile;

import * as React from 'react';
import FileInput from '../../../../../components/inputs/FileInput';
import {
  StyledInput,
  ErrorSpan,
  Li,
  StyledButton,
  PopupSpan,
  LinkSpan,
  P,
  StyledSelectBox,
  StyledVerticalTitleCard
} from './styleCompPC';
import {$POINT_BLUE, $BORDER_COLOR} from '../../../../../styles/variables.types';
import {staticUrl} from '../../../../../src/constants/env';
import ResponsiveLi from '../../../../UI/ResponsiveLi/ResponsiveLi';
import {useDispatch} from 'react-redux';
import {pushPopup} from '../../../../../src/reducers/popup';
import InfoPopup from './InfoPopup';
import {TSignupForm} from '../FormPC';
import UserApi from '../../../../../src/apis/UserApi';
import { VALIDATE_REGEX } from '../../../../../src/constants/validates';

const CertificationUserBtn = React.memo<ICertificationUserBtnProps>(props => {
  const {name, phone, onChange} = props;
  const [imp_uid, setImpUid] = React.useState('');

  // Logic Function
  const certificationUser = React.useCallback(() => {
    if (!name || !phone) {
      alert('이름과 휴대폰 번호를 입력해주세요');
      return null;
    }

    const {IMP} = window;
    IMP.init('imp07711701');
    IMP.certification(
      {merchant_uid: 'merchant_' + new Date().getTime(), name, phone},
      ({imp_uid}) => setImpUid(imp_uid),
    );
  }, [name, phone]);

  React.useEffect(() => {
    !!onChange && onChange(imp_uid);
  }, [onChange, imp_uid]);

  return (
    <StyledButton
      size={{width: '138px', height: '40px'}}
      font={{size: '13px', weight: '600', color: $POINT_BLUE}}
      border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
      onClick={certificationUser}
    >
      실명인증
    </StyledButton>
  );
});

export const SCHOOL_DICT = [
  {value: 'gcu', label: '가천대학교'},
  {value: 'ghu', label: '경희대학교'},
  {value: 'dhu', label: '대구한의대학교'},
  {value: 'dju', label: '대전대학교'},
  {value: 'dgu', label: '동국대학교'},
  {value: 'dsu', label: '동신대학교'},
  {value: 'deu', label: '동의대학교'},
  {value: 'bsu', label: '부산대학교'},
  {value: 'sju', label: '상지대학교'},
  {value: 'smu', label: '세명대학교'},
  {value: 'usu', label: '우석대학교'},
  {value: 'wgu', label: '원광대학교'},
];

const MIN_NICKNAME_LENGTH = 3;

interface ICertificationUserBtnProps {
  name: string;
  phone: string;
  onChange: (imp_uid: string) => void;
}

interface Props {
  signType: string;
  form: TSignupForm['basicInfo'];
  dispatchSignupForm: React.Dispatch<any>;
}

const BasicInfoPC = React.memo<Props>(
  ({signType, form, dispatchSignupForm}) => {
    // State
    const {password, password2, name, phone, cert_file, verificationNumber, error} = form;
    const {authIdErr, emailErr, passwordErr, password2Err, nameErr, nickNameErr, schoolErr, verificationNumberErr} = error;
    const {school} = verificationNumber;

    // Redux
    const dispatch = useDispatch();

    // Memo
    const showSignInfoPopup = React.useCallback(() => {
      dispatch(pushPopup(InfoPopup));
    }, []);

    const handleOnChangeBasicFormData = React.useCallback(({target: {name, value}}) => {
      dispatchSignupForm({type: 'KEY_FIELD', key: 'basicInfo', name, value});
    }, []);
    const setImpUid = React.useCallback(value => {
      dispatchSignupForm({type: 'KEY_FIELD', key: 'basicInfo', name: 'imp_uid', value});
    }, []);
    const fileUpload = React.useCallback(value => {
      dispatchSignupForm({type: 'KEY_FIELD', key: 'basicInfo', name: 'cert_file', value});
    }, []);

    const handleOnChangeVerification = React.useCallback(({target: {name, value}}) => {
      dispatchSignupForm({type: 'KEY_OBJECT_FILED', key: 'basicInfo', field: 'verificationNumber', name, value});
    }, []);
    const handleOnChangeSchool = React.useCallback(value => {
      dispatchSignupForm({type: 'KEY_OBJECT_FILED', key: 'basicInfo', field: 'verificationNumber', name: 'school', value});
    }, []);

    const setErrorBasicForm = React.useCallback((name: string, errMsg: string) => {
      dispatchSignupForm({type: 'KEY_ERROR', key: 'basicInfo', name, value: errMsg});
    }, []);

    React.useEffect(() => {
      handleOnChangeSchool(SCHOOL_DICT[0].value);
    }, [handleOnChangeSchool]);

    return (
      <StyledVerticalTitleCard title="기본 정보">
        <ul>
          <ResponsiveLi title="아이디">
            <StyledInput
              placeholder="5~20자 영문,숫자만 가능"
              name="auth_id"
              maxLength={20}
              onBlur={e => {
                const {target: {value}} = e;
                handleOnChangeBasicFormData(e);

                if (value.length < 5) {
                  setErrorBasicForm('authIdErr', '아이디를 5자 이상 입력해주세요.');
                  return null;
                } else if (value.length > 20) {
                  setErrorBasicForm('authIdErr', '아이디를 20자 이하로 입력해주세요.');
                  return null;
                } else if (!/^[a-zA-Z0-9_.+-]+$/.test(value)) {
                  setErrorBasicForm('authIdErr', '아이디 형식을 확인해주세요.');
                  return null;
                }

                UserApi.authId(value).then(({status}) => {
                  if (status === 409) {
                    setErrorBasicForm('authIdErr', '이미 존재하는 id입니다.');
                  } else {
                    setErrorBasicForm('authIdErr', '');
                  }
                });
              }}
            />
            {!!authIdErr && (
              <ErrorSpan>{authIdErr}</ErrorSpan>
            )}
          </ResponsiveLi>
          <ResponsiveLi title="이메일">
            <StyledInput
              placeholder="test@mail.com"
              name="email"
              onBlur={e => {
                const {target: {value}} = e;
                handleOnChangeBasicFormData(e);

                if (!VALIDATE_REGEX.VALIDATE_EMAIL[0].test(value)) {
                  setErrorBasicForm('emailErr', '이메일 양식을 확인해주세요.');
                  return null;
                }

                setErrorBasicForm('emailErr', '');
              }}
            />
            {!!emailErr && (
              <ErrorSpan>{emailErr}</ErrorSpan>
            )}
          </ResponsiveLi>
          <ResponsiveLi title="비밀번호">
            <StyledInput
              type="password"
              placeholder="8~20자(영문, 숫자만 가능)"
              name="password"
              maxLength={15}
              onBlur={e => {
                const {target: {value}} = e;
                handleOnChangeBasicFormData(e);

                setErrorBasicForm(
                  'password2Err',
                  password2 !== value ? '입력된 비밀번호가 서로 다릅니다.' : ''
                );

                if (value.length < 8 || value.length > 15) {
                  setErrorBasicForm('passwordErr', '비밀번호를 8자~15자로 입력해주세요.');
                  return null;
                } else if (!/^(?=.*\d)(?=.*[a-z]).{8,20}$/.test(value)) {
                  setErrorBasicForm('passwordErr', '비밀번호 입력 양식을 확인해주세요.');
                  return null;
                }

                setErrorBasicForm('passwordErr', '');
              }}
            />
            {!!passwordErr && (
              <ErrorSpan>{passwordErr}</ErrorSpan>
            )}
          </ResponsiveLi>
          <ResponsiveLi title="비밀번호 확인">
            <StyledInput
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              name="password2"
              maxLength={15}
              onBlur={e => {
                const {target: {value}} = e;
                handleOnChangeBasicFormData(e);

                if (password !== value) {
                  setErrorBasicForm('password2Err', '입력된 비밀번호가 서로 다릅니다.');
                  return null;
                }

                setErrorBasicForm('password2Err', '');
              }}
            />
            {!!password2Err && (
              <ErrorSpan>{password2Err}</ErrorSpan>
            )}
          </ResponsiveLi>
          <ResponsiveLi title="이름">
            <StyledInput
              placeholder="실명인증을 해주세요."
              name="name"
              onBlur={handleOnChangeBasicFormData}
            />
            {!!nameErr && (
              <ErrorSpan>{nameErr}</ErrorSpan>
            )}
          </ResponsiveLi>
          <ResponsiveLi title="휴대폰 번호">
            <ul>
              <Li>
                <StyledInput
                  telephone
                  numberOnly
                  name="phone"
                  placeholder="'-'없이 입력해주세요."
                  onBlur={handleOnChangeBasicFormData}
                />
              </Li>
              <Li>
                <CertificationUserBtn
                  name={name}
                  phone={phone}
                  onChange={setImpUid}
                />
              </Li>
            </ul>
            <PopupSpan onClick={showSignInfoPopup}>
              해외 거주자 본인인증 안내
              <img
                src={staticUrl('/static/images/icon/icon-help-btn.png')}
                alt="해외 거주자 본인인증 안내"
              />
            </PopupSpan>
          </ResponsiveLi>
          <ResponsiveLi title="닉네임">
            <StyledInput
              placeholder="3~10자(한글,영문,숫자만 가능)"
              name="nick_name"
              onBlur={e => {
                const {target: {value}} = e;
                handleOnChangeBasicFormData(e);

                if (value.trim().length >= MIN_NICKNAME_LENGTH) {
                  UserApi.authNickName(value)
                    .then(({data: {result: {is_exist}}}) => {
                      setErrorBasicForm('nickNameErr', is_exist
                        ? '이미 사용중인 닉네임입니다.'
                        : ''
                      );
                    });
                } else {
                  setErrorBasicForm('nickNameErr', `닉네임은 ${MIN_NICKNAME_LENGTH}자 이상이어야 합니다.`);
                }
              }}
            />
            {!!nickNameErr && (
              <ErrorSpan>{nickNameErr}</ErrorSpan>
            )}
          </ResponsiveLi>
          {signType === 'doctor' ? (
            <ResponsiveLi title="면허번호">
              <StyledInput
                numberOnly
                placeholder="숫자만 가능"
                name="doctor_number"
                onBlur={handleOnChangeVerification}
              />
              {!!verificationNumberErr && (
                <ErrorSpan>{verificationNumberErr}</ErrorSpan>
              )}
            </ResponsiveLi>
          ) : (
            <>
              <ResponsiveLi title="학교명">
                <StyledSelectBox
                  option={SCHOOL_DICT}
                  value={school}
                  onChange={handleOnChangeSchool}
                />
                {!!schoolErr && (
                  <ErrorSpan>{schoolErr}</ErrorSpan>
                )}
              </ResponsiveLi>
              <ResponsiveLi title="학번">
                <StyledInput
                  placeholder="2015-0000등의 전체 학번 입력"
                  name="student_number"
                  onBlur={handleOnChangeVerification}
                />
                {!!verificationNumberErr && (
                  <ErrorSpan>{verificationNumberErr}</ErrorSpan>
                )}
              </ResponsiveLi>
            </>
          )}
          <ResponsiveLi title="파일 첨부">
            <FileInput
              fileNameDisabled
              onChange={fileUpload}
            />
            <LinkSpan>{cert_file ? cert_file.name : '선택된 파일 없음'}</LinkSpan>
            <P>
              {signType === 'doctor'
                ? "면허증 사본을 첨부해주세요."
                : "이번 학기에 발급받은 재학증명서의 사본 첨부가 필요합니다."}
              &nbsp;
              <span>(8MB이내, 이미지 파일 또는 pdf)</span>
            </P>
          </ResponsiveLi>
        </ul>
      </StyledVerticalTitleCard>
    );
  }
);

BasicInfoPC.displayName = 'BasicInfoPC';
export default BasicInfoPC;

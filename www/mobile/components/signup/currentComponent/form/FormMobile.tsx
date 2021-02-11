import * as React from 'react';
import xor from 'lodash/xor';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from "next/router";
import Input from '../../../../components/inputs/Input';
import BasicInfoMobile from './basicInfo/BasicInfoMobile';
import SubscrPathMobile from './subscrPath/SubscrPathMobile';
import PurposeTextMobile from './purposeText/PurposeTextMobile';
import StyledButtonGroup from '../../StyledButtonGroup/index.mobile';
import MarketingAcceptMobile from './marketingAccept/MarketingAcceptMobile';
import UserApi from '../../../../src/apis/UserApi';
import saveValueAtNameReducer from '../../../../src/lib/element/saveValueAtNameReducer';
import {heightMixin} from '../../../../styles/mixins.styles';
import {ICurrentCompoentProps} from '../../../../pages/signup';
import {$BORDER_COLOR} from '../../../../styles/variables.types';

export const StyledInput = styled(Input)`
  width: 100%;
  ${heightMixin(44)}
  box-sizing: border-box;
  font-size: 13px;  
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
`;

const INITIAL_SIGNUP_FORM = {
  basicInfo: {
    imp_uid: '',
    auth_id: '',
    cert_file: null as File,
    email: '',
    name: '',
    password: '',
    password2:'',
    phone: '',
    nick_name: '',
    verificationNumber: {
      school: '',
      student_number: '',
      doctor_number: '',
    },
    error: {
      authIdErr: '',
      emailErr: '',
      passwordErr: '',
      password2Err: '',
      nameErr: '',
      nickNameErr: '',
      schoolErr: '',
      verificationNumberErr: '',
    },
  },
  subscrPath: {
    joinPath: '',
    directJoinPath: '',
    join_path_text: '',
    error: {
      joinPathErr: '',
    },
  },
  purpose: {
    purpose: [],
    purposeList: [],
    error: {
      purposeErr: '',
    },
  },
  marketingAccept: {
    is_email_receive: false,
    is_sms_receive: false,
  },
};

export type TSignupForm = typeof INITIAL_SIGNUP_FORM;

const signupFormReducer = (state, action) => {
  switch (action.type) {
    case 'KEY_FIELD':
      return {
        ...state,
        [action.key]: saveValueAtNameReducer(state[action.key], action),
      };
    case 'KEY_ERROR':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          error: saveValueAtNameReducer(state[action.key].error, action),
        },
      };
    case 'KEY_BLUK_ERROR':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          error: {
            ...state[action.key].error,
            ...action.value,
          }
        },
      };
    case 'KEY_TOGGLE_FIELD':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          [action.value]: !state[action.key][action.value]
        },
      };
    case 'KEY_OBJECT_FILED':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          [action.field]: saveValueAtNameReducer(state[action.key][action.field], action),
        }
      }
    case 'KEY_OBJ_TOGGLE_FIELD':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          [action.name]: xor(state[action.key][action.name], action.value)
        },
      };
  }
};

const FormMobile: React.FC<ICurrentCompoentProps> = React.memo(
  ({signType, next}) => {
    const [{basicInfo, subscrPath, purpose, marketingAccept}, dispatchSignupForm] = React.useReducer(signupFormReducer, INITIAL_SIGNUP_FORM);

    const router = useRouter();

    const errorSignup = React.useCallback((key, value) => {
      dispatchSignupForm({type: 'KEY_BLUK_ERROR', key, value});
    }, []);

    const isValid = () => {
      const {auth_id, email, password, password2, nick_name, imp_uid, verificationNumber} = basicInfo;
      const {student_number, doctor_number} = verificationNumber;
      const {join_path_text} = subscrPath;
      const {purpose: _purpose} = purpose;

      const basicInfoErr = {
        authIdErr: !auth_id ? '아이디가 입력되지 않았습니다.' : '',
        emailErr: !email ? '이메일이 입력되지 않았습니다.' : '',
        passwordErr: !password ? '비밀번호가 입력되지 않았습니다.' : '',
        password2Err: !password2 ? '비밀번호가 입력되지 않았습니다.' : '',
        nickNameErr: !nick_name ? '닉네임이 입력되지 않았습니다.' : '',
        verificationNumberErr: (!student_number && !doctor_number) ? '번호가 입력되지 않았습니다.' : '',
        nameErr: !imp_uid ? '실명 인증이 이뤄지지 않았습니다.' : '',
      };
      const subscrPathErr = {joinPathErr: !join_path_text ? '가입 경로를 체크해주세요.' : ''};
      const purposeErr = {purposeErr: isEmpty(_purpose) ? '서비스 이용 목적을 체크해주세요.' : ''};

      errorSignup('basicInfo', basicInfoErr);
      errorSignup('subscrPath', subscrPathErr);
      errorSignup('purpose', purposeErr);

      const formNotInputError = Object.values({
        ...basicInfoErr,
        ...subscrPathErr,
        ...subscrPathErr,
      }).every(item => !item);
      const formInputError = Object.values({
        ...basicInfo.error,
        ...subscrPath.error,
        ...purpose.error,
      }).every(item => !item);

      return formNotInputError && formInputError;
    };

    const sign = () => {
      const {error, name, verificationNumber, ...basicInfoData} = basicInfo;
      const {school, student_number, doctor_number} = verificationNumber;
      const {join_path_text} = subscrPath;
      const {purpose: _purpose} = purpose;

      const signData = {
        join_path_text,
        purpose: _purpose,
        ...basicInfoData,
        ...marketingAccept,
      };

      const formData = new FormData();

      Object.keys(signData).forEach(i => {
        if (Array.isArray(signData[i])) {
          for(const item of signData[i]) {
            formData.append(i, item);
          }
        } else {
          formData.append(i, signData[i]);
        }
      });

      if (signType === 'doctor') {
        formData.append('doctor_number', doctor_number);
      } else if (signType === 'student') {
        formData.append('school', school);
        formData.append('student_number', student_number);
      }

      UserApi.sign(signType, formData)
        .then(({status}) => {
          if (Math.floor(status / 100) !== 4) {
            next();
          }
        });
    };

    return (
      <>
        <BasicInfoMobile
          signType={signType}
          form={basicInfo}
          dispatchSignupForm={dispatchSignupForm}
        />
        <SubscrPathMobile
          form={subscrPath}
          dispatchSignupForm={dispatchSignupForm}
        />
        <PurposeTextMobile
          form={purpose}
          dispatchSignupForm={dispatchSignupForm}
        />
        <MarketingAcceptMobile
          form={marketingAccept}
          dispatchSignupForm={dispatchSignupForm}
        />
        <StyledButtonGroup
          leftButton={{
            onClick: () => confirm('회원가입을 그만두시겠습니까?') && router.back(),
            children: '취소',
          }}
          rightButton={{
            onClick: () => {
              isValid() && sign();
            },
            children: '확인',
          }}
        />
      </>
    );
  },
);

export default FormMobile;

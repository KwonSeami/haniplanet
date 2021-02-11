import * as React from 'react';
import {useRouter} from "next/router";
import {ICurrentComponentProps, TDoctalkSignType} from '../../../../pages/doctalk/signup';
import saveValueAtNameReducer from '../../../../src/lib/element/saveValueAtNameReducer';
import BasicInfoPC from './basicInfo/BasicInfoPC';
import BasicHospitalInfoPC from './basicInfo/BasicHospitalInfoPC';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../../styles/variables.types';
import StyledButtonGroup from '../../StyledButtonGroup';
import {VALIDATE_REGEX} from '../../../../src/constants/validates';
import DoctalkApi from '../../../../src/apis/DoctalkApi';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import {urlWithProtocol} from '../../../../src/lib/url';

const P = styled.p`
  float: right;
  transform: translateY(30px);
  ${fontStyleMixin({
    size: 11,
    color: $TEXT_GRAY
  })};
`;

interface IDoctalkBasicInfo {
  name: string;
  gender: string;
  birth: string;
  email: string;
  phone: string;
  educations_and_licenses: string;
  briefs: string;
  subject_code: string;
}

interface IDoctalkHospitalInfo {
  hospital_name: string;
  registration_number: string;
  jibun_address: string;
  road_address: string;
  detail_address: string;
  zip_code: string;
  longitude: string;
  latitude: string;
  link: string;
  telephone: string;
}

type TSignType = Exclude<TDoctalkSignType, ''>;

type TRequestBasicInfoForm = Omit<IDoctalkBasicInfo, 'name' | 'phone'>;

type TRequestForm<T extends TSignType> = T extends 'haniplanet'
  ? TRequestBasicInfoForm
  : TRequestBasicInfoForm & IDoctalkHospitalInfo;

export interface IDoctalkSignupForm {
  basicInfo: IDoctalkBasicInfo;
  hospitalInfo: IDoctalkHospitalInfo;
}

const INITIAL_SIGNUP_FORM = {
  // 기본 정보
  basicInfo: {
    name: '',
    gender: 'M',
    birth: '',
    email: '',
    phone: '',
    educations_and_licenses: '',
    briefs: '',
    subject_code: ''
  },
  // 한의원 정보
  hospitalInfo: {
    hospital_name: '',
    registration_number: '',
    jibun_address: '',
    road_address: '',
    detail_address: '',
    zip_code: '',
    longitude: '',
    latitude: '',
    link: '',
    telephone: ''
  }
};

const signupFormReducer = (state, action) => {
  switch (action.type) {
    case 'KEY_FIELD':
      return {
        ...state,
        [action.key]: saveValueAtNameReducer(state[action.key], action),
      };
    case 'KEY_BULK_FIELD':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          ...action.values
        }
      };
  }
};

const FormPC = React.memo<ICurrentComponentProps>(
  ({signType, next}) => {
    const doctalkApi: DoctalkApi = useCallAccessFunc(access => new DoctalkApi(access));

    const [{
      basicInfo,
      hospitalInfo
    }, dispatchSignupForm] = React.useReducer(signupFormReducer, INITIAL_SIGNUP_FORM);

    const router = useRouter();

    const isValidForm = (): [boolean, string | TRequestForm<TSignType>] => {
      const {
        VALIDATE_BIRTH: [birthRegex],
        VALIDATE_SPECIFIC_EMAIL,
      } = VALIDATE_REGEX;
      const [emailRegex] = VALIDATE_SPECIFIC_EMAIL({
        name: '네이버',
        value: 'naver.com'
      });

      const {
        birth,
        gender,
        email,
        educations_and_licenses,
        briefs,
        subject_code
      } = basicInfo;
      const {
        hospital_name,
        registration_number,
        jibun_address,
        road_address,
        detail_address,
        zip_code,
        longitude,
        latitude,
        link,
        telephone
      } = hospitalInfo;

      // signType이 haniplanet일 때는 기본 정보만 체크함
      if (!birth) {
        return [false, '생년월일을 입력해주세요.'];
      } else if (!birthRegex.test(birth)) {
        return [false, '형식에 맞는 생년월일을 입력해주세요.'];
      } else if (!email) {
        return [false, '네이버 이메일을 입력해주세요.'];
      } else if (!emailRegex.test(email)) {
        return [false, '형식에 맞는 네이버 이메일을 입력해주세요.'];
      } else if (!educations_and_licenses) {
        return [false, '학력 및 자격을 입력해주세요.'];
      } else if (!briefs) {
        return [false, '약력을 입력해주세요.'];
      } else if (!subject_code) {
        return [false, '진단과를 선택해주세요.'];
      }

      if (signType === 'hospital') {
        if (!hospital_name) {
          return [false, '소속 한의원 이름을 입력해주세요.'];
        } else if (!registration_number) {
          return [false, '사업자 등록번호를 입력해주세요.'];
        } else if (!(jibun_address && road_address && zip_code && latitude && longitude)) {
          return [false, '한의원 주소를 입력해주세요.'];
        } else if (!link) {
          return [false, '한의원 홈페이지 주소를 입력해주세요.'];
        } else if (!telephone) {
          return [false, '한의원 대표전화를 입력해주세요.'];
        }
      }

      const requestForm = {
        type: signType,
        birth,
        gender,
        email,
        educations_and_licenses,
        briefs,
        subject_code,
        ...(signType === 'hospital'
          ? {
            hospital_name,
            registration_number,
            jibun_address,
            road_address,
            ...(detail_address
              ? {
                detail_address
              }
              : {}
            ),
            zip_code,
            longitude,
            latitude,
            link: urlWithProtocol(link),
            telephone
          }
          : {}
        )
      };

      return [true, requestForm];
    };

    const signup = () => {
      const [isValid, result] = isValidForm();

      if (isValid) {
        confirm('회원가입 하시겠습니까?') && (
          doctalkApi.linkToDoctalk(result as TRequestForm<TSignType>)
            .then(({status}) => {
              if (status === 201) {
                next();
              }
            })
            .catch(() => {
              alert('문제가 발생하였습니다.\n다시 시도해주세요.');
            })
        );
      } else {
        alert(result);
      }
    };
 
    return (
      <section className="clearfix">
        {/* 기본 정보 */}
        <BasicInfoPC
          form={basicInfo}
          dispatchSignupForm={dispatchSignupForm}
        />
        {/* 한의원 정보 */}
        <BasicHospitalInfoPC
          signType={signType}
          form={hospitalInfo}
          dispatchSignupForm={dispatchSignupForm}
        />
        <P>
          *입력한 정보는 한의플래닛 내 나의 프로필/한의원에 추가됩니다
        </P>
        <StyledButtonGroup
          leftButton={{
            onClick: () => confirm('회원가입을 그만두시겠습니까?') && router.back(),
            children: '취소',
          }}
          rightButton={{
            onClick: () => signup(),
            children: '확인',
          }}
        />
      </section>
    );
  },
);

FormPC.displayName = 'FormPC';
export default FormPC;

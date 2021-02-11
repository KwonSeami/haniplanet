import * as React from 'react';
import {
  StyledInput,
  StyledVerticalTitleCard,
  ExplainSpan,
  StyledTextArea,
  ExampleSpan,
  StyledSelectBox
} from './styleCompPC';
import ResponsiveLi from '../../../../UI/ResponsiveLi/ResponsiveLi';
import {IDoctalkSignupForm} from '../FormPC';
import {staticUrl} from '../../../../../src/constants/env';
import Link from 'next/link';
import {useSelector, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import isEmpty from 'lodash/isEmpty';
import Radio from '../../../../UI/Radio/Radio';
import {DOCTALK_SUBJECTS} from '../../../../../src/constants/hospital';
import {birthAutoHyphen} from '../../../../../src/lib/format';

const GENDER_LIST = [
  {label: '남성', value: 'M'},
  {label: '여성', value: 'F'}
];

interface Props {
  form: Dig<IDoctalkSignupForm, 'basicInfo'>;
  dispatchSignupForm: React.Dispatch<any>;
}

const BasicInfoPC = React.memo<Props>(
  ({form, dispatchSignupForm}) => {
    // Redux
    const me = useSelector(
      ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm),
      shallowEqual 
    );

    // State
    const {
      name,
      gender,
      birth,
      email,
      phone,
      educations_and_licenses,
      briefs,
      subject_code
    } = form;

    const handleOnChangeBasicFormData = React.useCallback(({target: {name, value}}) => {
      dispatchSignupForm({type: 'KEY_FIELD', key: 'basicInfo', name, value});
    }, []);

    React.useEffect(() => {
      if (!isEmpty(me)) {
        const {name, phone} = me;

        dispatchSignupForm({
          type: 'KEY_BULK_FIELD',
          key: 'basicInfo', 
          values: {name, phone},
        });
      }
    }, [me]);

    return (
      <StyledVerticalTitleCard title="기본 정보">
        <ul>
          <ResponsiveLi title="이름">
            <StyledInput
              placeholder=""
              name="name"
              value={name}
              disabled
            />
          </ResponsiveLi>
          <ResponsiveLi title="성별">
            {GENDER_LIST.map(({label, value}) => (
              <Radio
                checked={value === gender}
                onClick={() => {
                  dispatchSignupForm({
                    type: 'KEY_FIELD',
                    key: 'basicInfo',
                    name: 'gender',
                    value
                  });
                }}
              >
                {label}
              </Radio>
            ))}
          </ResponsiveLi>
          <ResponsiveLi title="생년월일">
            <StyledInput
              name="birth"
              placeholder="1960-01-01"
              value={birth}
              onChange={({target: {name, value}}) => {
                dispatchSignupForm({
                  type: 'KEY_FIELD',
                  key: 'basicInfo',
                  name,
                  value: birthAutoHyphen(value)
                });
              }}
              maxLength={10}
            />
          </ResponsiveLi>
          <ResponsiveLi title="Email">
            <StyledInput
              placeholder="네이버 이메일을 입력해주세요"
              name="email"
              value={email}
              onChange={handleOnChangeBasicFormData}
            />
            <ExplainSpan>본인 명의의 네이버 이메일을 입력해주세요. 닥톡 아이디로 사용됩니다.</ExplainSpan>
          </ResponsiveLi>
          <ResponsiveLi title="휴대폰 번호">
            <StyledInput
              telephone
              numberOnly
              name="phone"
              placeholder=""
              value={phone}
              disabled
            />
            <ExplainSpan>
              휴대폰 번호가 변경 된 경우는 아래 버튼을 클릭 후<br/>
              프로필 수정 페이지에서 휴대폰 실명인증을 다시 시도해주세요.
              <Link href="/user/profile/edit">
                <a>
                  번호 변경하기
                  <img
                    src={staticUrl('/static/images/icon/arrow/icon-mini-arrow2.png')}
                    alt="화살표"
                  />
                </a>
              </Link>
            </ExplainSpan>
          </ResponsiveLi>
          <ResponsiveLi title="학력 및 자격">
            <StyledTextArea
              value={educations_and_licenses}
              name="educations_and_licenses"
              onChange={handleOnChangeBasicFormData}
            />
            <ExampleSpan>
              <span>*예시&nbsp;:</span>&nbsp;경희대학교 한의과 대학 졸업, 한의학 박사/한방재활의학과 전문의,<br/>
              Stanford Medical Center 혈관 센터 연수
            </ExampleSpan>
          </ResponsiveLi>
          <ResponsiveLi title="약력">
            <StyledTextArea
              value={briefs}
              name="briefs"
              onChange={handleOnChangeBasicFormData}
            />
            <ExampleSpan>
              <span>*예시&nbsp;:</span>&nbsp;현) 동의보감한의원 강남점 원장, 전)동의보감한방병원 진료원장,<br/>
              한방비만학회 정회원
            </ExampleSpan>
          </ResponsiveLi>
          <ResponsiveLi title="진단과 선택">
            <StyledSelectBox
              placeholder={<span>1개만 선택 가능합니다</span>}
              option={DOCTALK_SUBJECTS}
              value={subject_code}
              onChange={value => {
                dispatchSignupForm({
                  type: 'KEY_FIELD',
                  key: 'basicInfo',
                  name: 'subject_code',
                  value
                });
              }}
            />
          </ResponsiveLi>
        </ul>
      </StyledVerticalTitleCard>
    );
  }
);

BasicInfoPC.displayName = 'BasicInfoPC';

export default BasicInfoPC;

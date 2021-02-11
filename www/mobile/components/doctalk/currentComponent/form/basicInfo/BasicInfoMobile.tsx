import React from 'react';
import styled from 'styled-components';
import ResponsiveLi, {Div} from '../../../../UI/ResponsiveLi/ResponsiveLi';
import VerticalTitleCardMobile from '../../../../UI/Card/VerticalTitleCardMobile';
import {StyledInput, IDoctalkSignupForm} from '../FormMobile';
import {useSelector, shallowEqual} from 'react-redux';
import {staticUrl} from '../../../../../src/constants/env';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$TEXT_GRAY, $POINT_BLUE, $BORDER_COLOR} from '../../../../../styles/variables.types';
import TextArea from '../../../../hospital/style/TextArea';
import Link from 'next/link';
import Radio from '../../../../UI/Radio/Radio';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import {RootState} from '../../../../../src/reducers';
import isEmpty from 'lodash/isEmpty';
import SelectBox from '../../../../inputs/SelectBox';
import {DOCTALK_SUBJECTS} from '../../../../../src/constants/hospital';
import {birthAutoHyphen} from '../../../../../src/lib/format';

const StyledVerticalTitleCardMobile = styled(VerticalTitleCardMobile)`
  padding-bottom: 20px;
  
  h2 {
    padding-bottom: 23px;
    ${fontStyleMixin({
      size: 18,
    })};
  }

  .radio {
    display: inline-block;
    margin: 12px 32px 11px 0;

    span {
      top: 2px;
    }
  }

  @media screen and (max-width: 680px) {
    padding: 10px 14px 20px;
  }
`;

const StyledResponsiveLi = styled(ResponsiveLi)`
  ${Div} {
    padding-left: 0;
  }

  .certification li {
    margin-bottom: 0;
  }

  .phone {
    padding-bottom: 10px
  }
`;

const ExampleSpan = styled.span`
  display: block;
  padding-right: 2px;
  ${fontStyleMixin({
    size: 11,
    color: '#999'
  })};

  span {
    ${fontStyleMixin({
      size: 11,
      color: $POINT_BLUE
    })};
  }
`;

const ExplainSpan = styled.span`
  display: block;
  line-height: 18px;
  margin-top: 4px;
  ${fontStyleMixin({
    size: 11,
    color: $TEXT_GRAY
  })};

  a {
    display: block;
    text-decoration: underline;
    ${fontStyleMixin({
      size: 11,
      weight: '600'
    })};

    img {
      width: 11px;
      margin-left: 2px;
    }
  }
`;

const StyledTextArea = styled(TextArea)`
  height: 98px;
  margin-top: 0;

  &::placeholder {
    ${fontStyleMixin({
      size: 13,
      color: $TEXT_GRAY
    })};
  }
`;

const StyledSelectBox = styled(SelectBox)`
  height: 44px;

  p {
    ${fontStyleMixin({
      size: 13
    })};
      
    span {
      ${fontStyleMixin({
        size: 13,
        color: $TEXT_GRAY
      })};
    }
  }

  ul {
    margin-top: 3px;
    max-height: 145px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    li {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;

      &:last-child {
        border-bottom: 0;
      }
    }
  }
`;

const GENDER_LIST = [
  {label: '남성', value: 'M'},
  {label: '여성', value: 'F'}
];

interface Props {
  form: Dig<IDoctalkSignupForm, 'basicInfo'>;
  dispatchSignupForm: React.Dispatch<any>;
}

const BasicInfoMobile: React.FC<Props> = React.memo(
  ({form, dispatchSignupForm}) => {
    // Redux
    const me = useSelector(
      ({orm, system: {session: {id}}}: RootState) => pickUserSelector(id)(orm),
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

    // Memo
    const handleOnChangeBasicFormData = React.useCallback(({target: {name, value}}) => {
      dispatchSignupForm({type: 'KEY_FIELD', key: 'basicInfo', name, value});
    }, []);

    React.useEffect(() => {
      if (!isEmpty(me)) {
        const {
          name: _name,
          phone: _phone
        } = me;

        dispatchSignupForm({
          type: 'KEY_BULK_FIELD',
          key: 'basicInfo', 
          values: {
            name: _name,
            phone: _phone
          }
        });
      }
    }, [me]);

    return (
      <StyledVerticalTitleCardMobile title="기본 정보">
        <ul>
          <StyledResponsiveLi>
            <StyledInput
              placeholder=""
              name="name"
              value={name}
              disabled
            />
          </StyledResponsiveLi>
          <StyledResponsiveLi>
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
          </StyledResponsiveLi>
          <StyledResponsiveLi>
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
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledInput
              placeholder="네이버 이메일을 입력해주세요"
              name="email"
              value={email}
              onChange={handleOnChangeBasicFormData}
            />
            <ExplainSpan>본인 명의의 네이버 이메일을 입력해주세요. 닥톡 아이디로 사용됩니다.</ExplainSpan>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledInput
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
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledTextArea
              placeholder="학력 및 자격을 입력해주세요"
              value={educations_and_licenses}
              name="educations_and_licenses"
              onChange={handleOnChangeBasicFormData}
            />
            <ExampleSpan>
              <span>*예시&nbsp;:</span>&nbsp;경희대학교 한의과 대학 졸업, 한의학 박사/한방재활의학과 전문의, Stanford Medical Center 혈관 센터 연수
            </ExampleSpan>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledTextArea
              placeholder="약력을 입력해주세요"
              value={briefs}
              name="briefs"
              onChange={handleOnChangeBasicFormData}
            />
            <ExampleSpan>
              <span>*예시&nbsp;:</span>&nbsp;현) 동의보감한의원 강남점 원장, 전)동의보감한방병원 진료원장, 한방비만학회 정회원
            </ExampleSpan>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
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
          </StyledResponsiveLi>
        </ul>
      </StyledVerticalTitleCardMobile>
    );
  }
);

BasicInfoMobile.displayName = 'BasicInfoMobile';
export default BasicInfoMobile;

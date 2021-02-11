import * as React from 'react';
import styled from 'styled-components';
import Radio from '../../../UI/Radio/Radio';
import Input from '../../../inputs/Input';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$WHITE, $BORDER_COLOR} from '../../../../styles/variables.types';

const CounselTopDiv = styled.div`
  background-color: #f6f7f9;

  & > h2 {
    padding: 12px 0;
    text-align: center;
    font-size: 16px;
    background-color: ${$WHITE};
    

    strong {
      padding-right: 5px;
    }
  }

  @media screen and (max-width: 680px) {
    padding: 10px 0 0;

    & > h2 {
      margin: 0 15px;
    }
  }
`;

const CounselUl = styled.ul`
  max-width: 680px;
  margin: auto;
  box-sizing: border-box;
  padding: 17px 9px 0;

  h3 {
    ${fontStyleMixin({
      size: 11,
      weight: 'bold'
    })}
  }

  & > li {
    padding: 0 0 20px 10px;
    
    ul {
      padding: 11px 0 3px;

      li {
        display: inline-block;
        vertical-align: middle;
        padding-right: 28px;
      }
    }

    .error {
      padding-top: 5px;
      ${fontStyleMixin({ size: 11, color: '#ea6060' })}
    }
  }

  @media screen and (max-width: 680px) {
    padding: 16px 15px 0;

    & > li {
      padding-bottom: 22px;
    }
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 44px;
  font-size: 14px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
`;

export interface ICounselForm {
  gender: 'male' | 'female';
  age: string;
  phone: string;
}

interface Props {
  counselForm: ICounselForm;
  setCounselForm: React.Dispatch<React.SetStateAction<ICounselForm>>;
}

interface IGenger {
  label: string;
  value: ICounselForm['gender'];
}

const GENDER_LIST: IGenger[] = [
  {label: '여성', value: 'female'},
  {label: '남성', value: 'male'},
];

const CounselInfoFormMobile = React.memo<Props>(
  ({counselForm, setCounselForm}) => {
    const {gender, age, phone} = counselForm;
    return (
      <CounselTopDiv>
        <h2>
          <strong>온라인 상담</strong>
          기본정보 입력
        </h2>
        <CounselUl>
          <li>
            <h3>성별<span>(선택항목)</span></h3>
            <ul>
              {GENDER_LIST.map(({label, value}) => (
                <li key={`counsel-gender-${value}`}>
                  <Radio
                    checked={value === gender}
                    onClick={() => {
                      setCounselForm(curr => ({ ...curr, gender: value }));
                    }}
                  >
                    {label}
                  </Radio>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <h3>나이<span>(세)</span></h3>
            <StyledInput
              numberOnly
              placeholder="00"
              value={age}
              onChange={({target: {value}}) => {
                setCounselForm(curr => ({ ...curr, age: value }));
              }}
            />
          </li>
          <li>
            <h3>휴대전화<span>(선택항목)</span></h3>
            <StyledInput 
              numberOnly
              placeholder="'-' 없이, 입력해주세요."
              value={phone}
              onChange={({target: {value}}) => {
                setCounselForm(curr => ({ ...curr, phone: value }));
              }}
            />
            <p className="error">
              ※ 입력 시, SMS 알림의 용도로만 사용되며, 저장/공개되지 않습니다.
            </p>
          </li>
        </CounselUl>
      </CounselTopDiv>
    );
  }
);

CounselInfoFormMobile.displayName = 'CounselInfoFormMobile';
export default CounselInfoFormMobile;

import * as React from 'react';
import styled from 'styled-components';
import Radio from '../../UI/Radio/Radio';
import Input from '../../inputs/Input';
import {dispatch, useGlobalState} from '../editorState';
import {heightMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $WHITE} from '../../../styles/variables.types';

const StyledRadio = styled(Radio)`
  span {
    top: 2px;
    background-color: ${$WHITE};
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  font-size: 14px;
  ${heightMixin(47)};
  &[type="number"] {
    border-bottom: 1px solid ${$BORDER_COLOR};
  }
`;

interface IGenger {
  label: string;
  value: 'male' | 'female';
}

const GENDER_LIST: IGenger[] = [
  {label: '여성', value: 'female'},
  {label: '남성', value: 'male'},
];

const onChangeUserInfo = ({target: {name, value}}) => {
  dispatch({type: 'SAVE_OBJ_FIELD', field: 'userInfo', name, value});
};

const CounselEditorTitle = () => {
  const [{gender, age, phone}] = useGlobalState('userInfo');

  return (
    <div className="counseling-select clearfix">
      <h2>
        <strong>온라인 상담</strong>
        기본정보 입력
      </h2>
      <ul>
        <li>
          <h3>성별</h3>
          <div>
            <ul>
              {GENDER_LIST.map(({label, value}) => (
                <li key={`counsel-gender-${value}`}>
                  <StyledRadio
                    checked={value === gender}
                    onClick={() => dispatch({type: 'SAVE_OBJ_FIELD', field: 'userInfo', name: 'gender', value})}
                  >
                    {label}
                  </StyledRadio>
                </li>
              ))}
            </ul>
          </div>
        </li>
        <li>
          <h3>
            나이
            <span>(세)</span>
          </h3>
          <div>
            <StyledInput
              numberOnly
              placeholder="00"
              value={age}
              name="age"
              onChange={onChangeUserInfo}
            />
          </div>
        </li>
        <li>
          <h3>
            휴대전화
            <span>(선택항목)</span>
          </h3>
          <div>
            <StyledInput
              numberOnly
              placeholder="'-' 없이, 입력해주세요."
              value={phone}
              name="phone"
              onChange={onChangeUserInfo}
            />
          </div>
        </li>
      </ul>
      <em>※ 입력 시, SMS 알림의 용도로만 사용되며, 저장/공개되지 않습니다.</em>
    </div>
  );
};

CounselEditorTitle.displayName = 'CounselEditorTitle';
export default CounselEditorTitle;

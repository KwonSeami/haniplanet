import * as React from 'react';
import styled from 'styled-components';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import Input from '../../inputs/Input';
import Radio from '../../UI/Radio/Radio';
import StyledEditorTitle from './StyledEditorTItle';
import StyledCounselTitle from './StyledCounselTitle';
import EditorTitle, {IOpenRangeOption} from './EditorTitle';
import {staticUrl} from '../../../src/constants/env';
import {heightMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../../styles/variables.types';

const StyledInput = styled(Input)`
  width: 100%;
  font-size: 14px;
  ${heightMixin(41)};
  &[type="number"] {
    border-bottom: 1px solid ${$BORDER_COLOR};
  }
`;

const GENDER_LIST: IGender[] = [
  {label: '여성', value: 'female'},
  {label: '남성', value: 'male'},
];

interface IGender {
  label: string;
  value: 'male' | 'female';
}

interface Props {
  defaultUserType?: string[];
  openRangeList: IOpenRangeOption[];
}

const CounselEditorTitle = React.memo<Props>(({openRangeList, defaultUserType}) => {
  const {register, setValue, watch} = useFormContext();
  const gender = watch('gender');

  React.useEffect(() => {
    register({name: 'gender', value: ''});
  }, [register]);

  return (
    <StyledEditorTitle>
      <StyledCounselTitle>
        <button type="button" className="close">
          <img
            src={staticUrl('/static/images/icon/icon-close.png')}
            alt="닫기"
          />
        </button>
        <h2>
          <strong>온라인 상담</strong>
          기본정보 입력
        </h2>
        <div>
          <ul>
            <li>
              <h3>성별</h3>
              <div>
                <ul>
                  {GENDER_LIST.map(({label, value}) => (
                    <li key={`counsel-gender-${value}`}>
                      <Radio
                        checked={gender === value}
                        onClick={() => setValue('gender', value)}
                      >
                        {label}
                      </Radio>
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
                  name="age"
                  type="number"
                  ref={register}
                  placeholder="00"
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
                  name="phone"
                  type="number"
                  ref={register}
                  placeholder="'-' 없이, 입력해주세요."
                />
              </div>
            </li>
          </ul>
          <em>※ 입력 시, SMS 알림의 용도로만 사용되며, 저장/공개되지 않습니다.</em>
        </div>
      </StyledCounselTitle>
      <EditorTitle
        openRangeList={openRangeList}
        defaultUserType={defaultUserType}
      />
    </StyledEditorTitle>
  )
});

export default React.memo(CounselEditorTitle);

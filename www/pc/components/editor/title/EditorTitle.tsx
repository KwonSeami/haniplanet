import * as React from 'react';
import xor from 'lodash/xor';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import Input from '../../inputs/Input';
import SelectBox from '../../inputs/SelectBox';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import StyledEditorCoreTitle from './StyledEditorCoreTitle';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import {shallowEqual, useSelector} from "react-redux";
import {pickUserSelector} from "../../../src/reducers/orm/user/selector";
import {RootState} from "../../../src/reducers";

const StyledSelectBox = styled(SelectBox)`
  position: relative;
  display: inline-block;
  width: 120px;
  height: 42px;
  margin-top: 34px;
  border-bottom: 0;

  p {
    position: relative;
    padding-left: 23px;
    font-size: 15px;
    text-decoration: underline;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-49%);
      width: 17px;
      height: 17px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-eye.png'),
        size: '100%',
      })};
    }

    img {
      right: 10px;
    }
  }
  
  ul {
    left: -2px;
    margin-top: 0;

    li {
      margin-top: 0px;
      border-top-width: 0;
      box-sizing: border-box;
      background-color: #fff;

      &:first-child {
        border-top-width: 1;
        border-top: 1px solid ${$BORDER_COLOR};
      }
    }
  }

  &::-ms-expand {
    display: none;
  }
`;

const OptionCheckBox = styled(CheckBox)`
  label {
    padding-left: 23px;
  }
`;

const USER_TYPE = {
  doctor: '한의사',
  student: '학생',
  consultant: '전문가',
} as const;

export interface IOpenRangeOption {
  label: string;
  value: string;
}

interface Props {
  defaultUserType?: string[];
  openRangeList: IOpenRangeOption[];
}

const EditorTitle = React.memo<Props>(({defaultUserType, openRangeList}) => {
  const {register, setValue, watch} = useFormContext();

  const {user_type: myUserType} = useSelector(
    ({system: {session: {id}}, orm}: RootState) => pickUserSelector(id)(orm),
    shallowEqual,
  );

  const open_range = watch('open_range');
  const user_types = watch('user_types');

  return (
    <StyledEditorCoreTitle>
      <Input
        name="title"
        ref={register}
        className="title-input"
        placeholder="자유롭게 제목을 작성해주세요."
      />
      <div>
        {!isEmpty(openRangeList) && (
          <StyledSelectBox
            value={open_range}
            option={openRangeList}
            onChange={value => setValue('open_range', value)}
          />
        )}
        {open_range === 'user_all' && (
          <ul className="user-option-box">
            {Object.keys(USER_TYPE).map(key => (
              <li key={`editor-user-${key}`}>
                <OptionCheckBox
                  checked={(user_types || []).includes(key)}
                  onChange={() => {
                    if (![myUserType, ...(defaultUserType || [])].includes(key)) {
                      setValue('user_types', xor(user_types, [key]));
                    }
                  }}
                >
                  {USER_TYPE[key]}
                </OptionCheckBox>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StyledEditorCoreTitle>
  )
});

export default EditorTitle;

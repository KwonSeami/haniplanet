import * as React from 'react';
import uniq from 'lodash/uniq';
import styled from 'styled-components';
import {useSelector, shallowEqual} from 'react-redux';
import Input from '../../inputs/Input';
import SelectBox from '../../inputs/SelectBox';
import BasicEditorTitle from './BasicEditorTitle';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import CounselEditorTitle from './CounselEditorTitle';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin} from '../../../styles/mixins.styles';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {onChangeEditorInputAtName, useGlobalState, dispatch} from '../editorState';
import {$BORDER_COLOR} from '../../../styles/variables.types';

const StyledSelectBox = styled(SelectBox)`
  position: relative;
  display: inline-block;
  width: 120px;
  height: 42px;
  margin-top: 34px;
  padding-left: 2px;
  border-bottom: 0;

  p{
    position: relative;
    padding-left: 25px;
    font-size: 15px;
    text-decoration: underline;

    &::after {
      content: '';
      position: absolute;
      left: 2px;
      top: 50%;
      transform: translateY(-49%);
      width: 17px;
      height: 17px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-eye.png'),
        size: '100%'
      })};
    }

    img {
      right: 8px;
    }
  }
  
  ul {
    margin-top: -1px;

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
    padding-left: 21px;

    &::before {
      top: 2px;
      width: 16px;
      height: 16px;
    }
  }
`;

const USER_TYPE = {
  doctor: '한의사',
  student: '학생',
  consultant: '전문가',
} as const;

interface Props {
  isCounsel?: boolean;
  openRangeList: any;
  defaultUserType?: any;
  band?: any;
}

const onChangeOpenRange = value => dispatch({type: 'FIELD', name: 'open_range', value});
const onChangeUserType = value => dispatch({type: 'FIELD', name: 'user_types', value});

const EditorTitle: React.FC<Props> = ({isCounsel, openRangeList, defaultUserType, band}) => {
  const [title] = useGlobalState('title');
  const [open_range] = useGlobalState('open_range');
  const [user_types] = useGlobalState('user_types');

  const me = useSelector(
    ({orm, system: {session: {id}}}) => (pickUserSelector(id)(orm) || {}),
    shallowEqual,
  );
  const {user_type} = me || {} as any;

  React.useEffect(() => {
    if (!!openRangeList) {
      const defaultOpenRange = isCounsel
        ? 'human'
        : openRangeList[0].value === 'band' ? 'band' : 'user_all';
      onChangeOpenRange(open_range || defaultOpenRange);
    }
  }, [isCounsel, openRangeList]);

  React.useEffect(() => {
    const defaultTypes = defaultUserType || [];

    const userTypes = !!user_type
      ? [...defaultTypes, ...user_types, user_type]
      : [...defaultTypes, ...user_types];
    onChangeUserType(uniq(userTypes));
  }, [defaultUserType, user_type]);

  return (
    <div className="editor-title">
      {isCounsel ? <CounselEditorTitle /> : <BasicEditorTitle band={band} />}
      <div className="title-or-Range">
        <Input
          className="title-input"
          placeholder="자유롭게 제목을 작성해주세요."
          name="title"
          value={title}
          onChange={onChangeEditorInputAtName}
        />
        <div>
          <StyledSelectBox
            value={open_range}
            option={openRangeList}
            onChange={onChangeOpenRange}
          />
          {open_range == 'user_all' && (
            <ul className="user-option-box">
              {Object.keys(USER_TYPE).map(key => (
                <li key={`editor-user-${key}`}>
                  <OptionCheckBox
                    checked={user_types.includes(key)}
                    onChange={() => {
                      if (![...(defaultUserType || []), user_type].includes(key)) {
                        dispatch({
                          type: 'TOGGLE_FIELD',
                          field: 'user_types',
                          value: [key]
                        });
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
      </div>
    </div>
  );
};

export default React.memo<Props>(EditorTitle);

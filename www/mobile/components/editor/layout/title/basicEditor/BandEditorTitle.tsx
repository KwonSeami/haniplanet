import * as React from 'react';
import cn from 'classnames';
import xor from 'lodash/xor';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {shallowEqual, useSelector} from 'react-redux';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import StyledBasicTitle from './style/StyledBasicTitle';
import StyledEditorTitle from './style/StyledEditorTItle';
import BandEditorSelectBox from './style/BandEditorSelectBox';
import CheckBox from '../../../../UI/Checkbox1/CheckBox';
import Avatar from '../../../../Avatar';
import Input from '../../../../inputs/Input';
import Loading from '../../../../common/Loading';
import BandApi from '../../../../../src/apis/BandApi';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {RootState} from '../../../../../src/reducers';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import StyledEditorCoreTitle from './style/StyledEditorCoreTitle';

const OptionCheckBox = styled(CheckBox)`
  label {
    padding-left: 23px;
  }
`;

const USER_EXPOSE_TYPE_MAP = {
  real: '실명',
  nick: '닉네임',
  anon: '익명',
} as const;

const USER_TYPE = {
  doctor: '한의사',
  student: '학생',
  consultant: '전문가',
} as const;

interface Props {
  defaultValue?: any;
  bandSlug?: string;
  bandUserExposeType?: string;
  defaultUserType?: string[];
  openRangeList: Array<{
    label: string;
    value: string;
  }>;
}

const BandEditorTitle: React.FC<Props> = ({
  defaultValue,
  bandSlug,
  bandUserExposeType,
  defaultUserType,
  openRangeList,
}) => {
  // Form Context
  const {register, watch, setValue} = useFormContext();
  const user_expose_type = watch('user_expose_type');
  const open_range = watch('open_range');
  const user_types = watch('user_types');

  // State
  const [contextPending, setContextPending] = React.useState(true);
  const [nickName, setNickName] = React.useState('');

  // Redux
  const me = useSelector(
    ({orm, system: {session : {id}}}: RootState) => pickUserSelector(id)(orm),
    shallowEqual,
  );

  // API
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  React.useEffect(() => {
    // Value Register
    register({name: 'user_expose_type', value: 'real'});
    register({name: 'open_range', value: ''});
    register({name: 'user_types', value: [me.user_type]});

    setContextPending(false);
  }, [me.user_type]);

  React.useEffect(() => {
    if (!contextPending) {
      if (isEmpty(defaultValue)) {
        setValue('open_range', openRangeList[0].value);
      } else {
        setValue('open_range', defaultValue.open_range);
      }
    }
  }, [contextPending, defaultValue, openRangeList]);

  React.useEffect(() => {
    // Save bandUserExposeType
    if (!!bandUserExposeType) {
      setValue('user_expose_type', bandUserExposeType);

      // Save Band NickName
      if (bandUserExposeType === 'nick') {
        bandApi.me(bandSlug)
          .then(({status, data: {result}}) => {
            if (status === 200 && result) {
              setNickName(result.nick_name);
            }
          });
      } else {
        setNickName(me.nickname);
      }
    }
  }, [bandSlug, bandUserExposeType, me.nick_name]);

  if (contextPending) return <Loading />;

  return (
    <StyledEditorTitle>
      <StyledBasicTitle>
        <Avatar
          size={22}
          src={me.avatar}
          userExposeType={user_expose_type}
          {...me}
          nick_name={nickName}
        />
        <ul>
          {Object.keys(USER_EXPOSE_TYPE_MAP).map(key => (
            (!bandUserExposeType || (bandUserExposeType === key || key === 'anon')) && (
              <li
                className={cn({on: key === user_expose_type})}
                onClick={() => setValue('user_expose_type', key)}
              >
                {USER_EXPOSE_TYPE_MAP[key]}
              </li>
            )
          ))}
        </ul>
      </StyledBasicTitle>
      <StyledEditorCoreTitle>
        <Input
          name="title"
          ref={register}
          className="title-input"
          defaultValue={defaultValue?.title}
          placeholder="제목을 작성해주세요."
        />
        <div>
          {!isEmpty(openRangeList) && (
            <BandEditorSelectBox
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
                      if (![me.user_type, ...(defaultUserType || [])].includes(key)) {
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
    </StyledEditorTitle>
  );
};

export default React.memo(BandEditorTitle);

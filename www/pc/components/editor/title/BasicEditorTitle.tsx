import * as React from 'react';
import cn from 'classnames';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import {shallowEqual, useSelector} from 'react-redux';
import Avatar from '../../AvatarDynamic';
import StyledBasicTitle from './StyledBasicTitle';
import StyledEditorTitle from './StyledEditorTItle';
import EditorTitle, {IOpenRangeOption} from './EditorTitle';
import BandApi from '../../../src/apis/BandApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {RootState} from '../../../src/reducers';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';

const USER_EXPOSE_TYPE_MAP = {
  real: '실명',
  nick: '닉네임',
  anon: '익명',
};

interface Props {
  band?: any;
  defaultUserType?: string[];
  openRangeList: IOpenRangeOption[];
}

const BasicEditorTitle = React.memo<Props>(({band, defaultUserType, openRangeList}) => {
  const {slug, user_expose_type: bandUserExposeType} = band || {} as any;

  const [bandMyInfo, setBandMyInfo] = React.useState<any>({});
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));
  const {setValue, watch} = useFormContext();
  const user_expose_type = watch('user_expose_type');

  const me = useSelector(
    ({orm, system: {session: {id}}}: RootState) => pickUserSelector(id)(orm) || {} as any,
    shallowEqual,
  );

  const myInfo = {
    ...me,
    nick_name: (bandUserExposeType === 'nick' ? bandMyInfo : me).nick_name,
  };

  React.useEffect(() => {
    if (!!bandUserExposeType) {
      setValue('user_expose_type', bandUserExposeType);

      if (bandUserExposeType === 'nick') {
        bandApi.me(slug)
          .then(({status, data: {result}}) => {
            if (status === 200 && !!result) {
              setBandMyInfo(result);
            }
          });
      }
    }
  }, [bandUserExposeType, slug]);

  return (
    <StyledEditorTitle>
      <StyledBasicTitle>
        <Avatar
          size={22}
          src={me.avatar}
          userExposeType={user_expose_type}
          {...myInfo}
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
        {user_expose_type === 'anon' && (
          <span>※ 익명의 글 작성 시, 수정/삭제가 불가능합니다.</span>
        )}
      </StyledBasicTitle>
      <EditorTitle
        openRangeList={openRangeList}
        defaultUserType={defaultUserType}
      />
    </StyledEditorTitle>
  );
});

BasicEditorTitle.displayName = 'BasicEditorTitle';
export default React.memo<Props>(BasicEditorTitle);

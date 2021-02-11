import * as React from 'react';
import cn from 'classnames';
import {shallowEqual, useSelector} from 'react-redux';
import Avatar from '../../AvatarDynamic';
import BandApi from '../../../src/apis/BandApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {useGlobalState, dispatch} from '../editorState';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import styled from 'styled-components';

const StyledAvatar = styled(Avatar)`
  & > div {
    margin: -2px 6px 0 0;
    vertical-align: middle;
  }
`;

const USER_EXPOSE_TYPE_MAP = {
  real: '실명',
  nick: '닉네임',
  anon: '익명',
};

interface Props {
  band: any;
}

const BasicEditorTitle: React.FC<Props> = ({band}) => {
  const {slug, user_expose_type: bandUserExposeType} = band || {} as any;

  const [bandMyInfo, setBandMyInfo] = React.useState<any>({});
  const [user_expose_type] = useGlobalState('user_expose_type');
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const me = useSelector(
    ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {} as any,
    shallowEqual,
  );

  const myInfo = {
    ...me,
    nick_name: (bandUserExposeType === 'nick' ? bandMyInfo : me).nick_name,
  };

  React.useEffect(() => {
    if (!!bandUserExposeType) {
      dispatch({type: 'FIELD', name: 'user_expose_type', value: bandUserExposeType});

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
    <div className="user-select">
      <StyledAvatar
        size={22}
        userExposeType={user_expose_type} 
        src={me.avatar} 
        {...myInfo} 
      />
      <ul>
        {Object.keys(USER_EXPOSE_TYPE_MAP).map(key => (
          (!bandUserExposeType || (bandUserExposeType === key || key === 'anon')) && (
            <li
              className={cn({on: key === user_expose_type})}
              onClick={() => dispatch({type: 'FIELD', name: 'user_expose_type', value: key})}
            >
              {USER_EXPOSE_TYPE_MAP[key]}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

BasicEditorTitle.displayName = 'BasicEditorTitle';
export default React.memo<Props>(BasicEditorTitle);

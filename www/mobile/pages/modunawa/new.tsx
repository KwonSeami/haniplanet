import * as React from 'react';
import StoryApi from '../../src/apis/StoryApi';
import useWriteStoryInit from '../../components/story/useWriteStoryInit';
import useSaveApiResult from '../../src/hooks/useSaveApiResult';
import TagApi from '../../src/apis/TagApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {useRouter} from 'next/router';
import {MAIN_USER_TYPES} from '../../src/constants/users';
import HaniStoryEditor from '../../components/editor/HaniStoryEditor';
import UserApi from '../../src/apis/UserApi';
import {shallowEqual, useSelector} from 'react-redux';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {getOpenRangeOption} from "../../src/lib/editor";

const ModunawaStoryNewMobile = React.memo(() => {
  const {
    defaultOpenRangeState: {defaultOpenRange},
    defaultAttachListState: {defaultAttachList, setDefaultAttachList},
    defaultDictListState: {defaultDictList, setDefaultDictList},
    defaultTagListState: {defaultTagList, setDefaultTagList},
  } = useWriteStoryInit();

  const {query: {defaultTagId}} = useRouter();
  const tagApi: TagApi = defaultTagId && useCallAccessFunc(access => new TagApi(access));
  const {resData: pageTags} = useSaveApiResult(() => tagApi && tagApi.retrieve(defaultTagId as string));

  const defaultTagListProps = React.useMemo(() => (
    !!pageTags ? [{...pageTags, saveTag: true}] : []
  ), [pageTags]);

  const {userId, user_type} = useSelector(
    ({orm, system: {session: {id}}}) => ({
      userId: id,
      user_type: pickUserSelector(id)(orm) || {} as any
    }),
    shallowEqual,
  );

  const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));

  return (
    <HaniStoryEditor
      defaultUserType={[user_type]}
      defaultOpenRange={defaultOpenRange}
      defaultTagListProps={defaultTagListProps}
      defaultAttachListState={{defaultAttachList, setDefaultAttachList}}
      defaultDictListState={{defaultDictList, setDefaultDictList}}
      defaultTagListState={{defaultTagList, setDefaultTagList}}
      writeStoryApi={formData => userApi.newStory(userId, formData)}
      openRangeList={getOpenRangeOption(['human', 'user_all', 'only_me'])}
    />
  );
});


ModunawaStoryNewMobile.displayName = 'ModunawaStoryNewMobile';
export default ModunawaStoryNewMobile;

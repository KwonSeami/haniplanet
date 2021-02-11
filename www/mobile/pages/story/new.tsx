import * as React from 'react';
import isEqual from 'lodash/isEqual';
import {useSelector} from 'react-redux';
import UserApi from '../../src/apis/UserApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import useWriteStoryInit from '../../components/story/useWriteStoryInit';
import {useRouter} from 'next/router';
import TagApi from '../../src/apis/TagApi';
import useSaveApiResult from '../../src/hooks/useSaveApiResult';
import HaniStoryEditor from '../../components/editor/HaniStoryEditor';
import {getOpenRangeOption} from "../../src/lib/editor";

const StoryNewMobile = React.memo(() => {
  const {userId} = useSelector(
    ({system: {session: {id: userId}}}) => ({userId}),
    (prev, curr) => isEqual(prev, curr),
  );
  const {
    defaultOpenRangeState: {defaultOpenRange},
    defaultAttachListState: {defaultAttachList, setDefaultAttachList},
    defaultDictListState: {defaultDictList, setDefaultDictList},
    defaultTagListState: {defaultTagList, setDefaultTagList},
  } = useWriteStoryInit();

  const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));

  const {query: {defaultTagId}} = useRouter();
  const tagApi: TagApi = defaultTagId && useCallAccessFunc(access => new TagApi(access));
  const {resData: pageTags} = useSaveApiResult(() => tagApi && tagApi.retrieve(defaultTagId as string));

  const defaultTagListProps = React.useMemo(() => (
    !!pageTags ? [{...pageTags, saveTag: true}] : []
  ), [pageTags]);

  return (
    <HaniStoryEditor
      writeStoryApi={formData => userApi.newStory(userId, formData)}
      defaultOpenRange={defaultOpenRange}
      defaultTagListProps={defaultTagListProps}
      defaultAttachListState={{defaultAttachList, setDefaultAttachList}}
      defaultDictListState={{defaultDictList, setDefaultDictList}}
      defaultTagListState={{defaultTagList, setDefaultTagList}}
      openRangeList={getOpenRangeOption(['human', 'user_all', 'only_me'])}
    />
  );
});


StoryNewMobile.displayName = 'StoryNewMobile';
export default StoryNewMobile;

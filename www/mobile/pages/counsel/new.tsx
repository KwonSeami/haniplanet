import * as React from 'react';
import StoryApi from '../../src/apis/StoryApi';
import useWriteStoryInit from '../../components/story/useWriteStoryInit';
import useSaveApiResult from '../../src/hooks/useSaveApiResult';
import TagApi from '../../src/apis/TagApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {useRouter} from 'next/router';
import {MAIN_USER_TYPES} from '../../src/constants/users';
import HaniStoryEditor from '../../components/editor/HaniStoryEditor';
import {getOpenRangeOption} from "../../src/lib/editor";

const StoryNewMobile = React.memo(() => {
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

  return (
    <HaniStoryEditor
      isCounsel
      defaultUserType={MAIN_USER_TYPES}
      defaultOpenRange={defaultOpenRange}
      defaultTagListProps={defaultTagListProps}
      defaultAttachListState={{defaultAttachList, setDefaultAttachList}}
      defaultDictListState={{defaultDictList, setDefaultDictList}}
      defaultTagListState={{defaultTagList, setDefaultTagList}}
      writeStoryApi={formData => StoryApi.newStory(formData)}
      openRangeList={getOpenRangeOption('human')}
    />
  );
});

StoryNewMobile.displayName = 'StoryNewMobile';
export default StoryNewMobile;

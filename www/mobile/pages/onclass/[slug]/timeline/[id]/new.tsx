import * as React from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useRouter} from 'next/router';
import {makeFeedKey} from '../../../../../src/lib/feed';
import TimelineApi from '../../../../../src/apis/TimelineApi';
import {fetchBandThunk} from '../../../../../src/reducers/orm/band/thunks';
import {writeFeed} from '../../../../../src/reducers/feed';
import loginRequired from '../../../../../hocs/loginRequired';
import useWriteStoryInit from '../../../../../components/story/useWriteStoryInit';
import HaniStoryEditor from '../../../../../components/editor/HaniStoryEditor';
import {pickBandSelector} from '../../../../../src/reducers/orm/band/selector';
import {getOpenRangeOption} from "../../../../../src/lib/editor";
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {pickTimelineSelector} from '../../../../../src/reducers/orm/timeline/selector';
import OnClassApi from '../../../../../src/apis/OnClassApi';
import userTypeRequired from '../../../../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../../../../src/constants/users';

const OnClassWrite: React.FC = React.memo(() => {
  const router = useRouter();
  const pathname = router.asPath.split('?')[0];
  const {query: {slug, id: timelineParams}} = router;
  const {
    defaultOpenRangeState: {defaultOpenRange},
    defaultAttachListState: {defaultAttachList, setDefaultAttachList},
    defaultDictListState: {defaultDictList, setDefaultDictList},
    defaultTagListState: {defaultTagList, setDefaultTagList},
  } = useWriteStoryInit();

  // Redux
  const {timeline, band} = useSelector(
    ({orm}) => ({
      timeline: pickTimelineSelector(timelineParams)(orm),
      band: pickBandSelector(slug)(orm),
    }),
    shallowEqual,
  );
  const dispatch = useDispatch();

  // Api
  const timelineApi: TimelineApi = useCallAccessFunc(access => new TimelineApi(access));
  const onClassApi: OnClassApi = useCallAccessFunc(access => access && new OnClassApi(access));

  React.useEffect(() => {
    // band 리듀서의 정보를 가져옵니다.
    dispatch(fetchBandThunk(onClassApi, slug));
  }, [slug]);

  if (!timeline) {
    return null;
  }
  const {write_range} = timeline;

  return (
    <HaniStoryEditor
      writeCallback={(result) => {
        dispatch(writeFeed({key: makeFeedKey(pathname), result}));
      }}
      writeStoryApi={(formData) => timelineApi.newStory(timelineParams, formData)}
      defaultOpenRange={defaultOpenRange}
      defaultAttachListState={{defaultAttachList, setDefaultAttachList}}
      defaultDictListState={{defaultDictList, setDefaultDictList}}
      defaultTagListState={{defaultTagList, setDefaultTagList}}
      band={band}
      openRangeList={write_range === 'band'
        ? getOpenRangeOption('band')
        : getOpenRangeOption(['human', 'user_all', 'band', 'only_me'])}
    />
  );
});

OnClassWrite.displayName = 'OnClassWrite';
export default loginRequired(
  userTypeRequired(
    OnClassWrite,
    [...MAIN_USER_TYPES, 'hani']
  )
);

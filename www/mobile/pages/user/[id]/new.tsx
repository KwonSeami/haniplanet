import * as React from 'react';
import isEqual from 'lodash/isEqual';
import {useSelector, useDispatch} from 'react-redux';
import UserApi from '../../../src/apis/UserApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {fetchUserThunk} from '../../../src/reducers/orm/user/thunks';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {writeFeed} from '../../../src/reducers/feed';
import {makeFeedKey} from '../../../src/lib/feed';
import loginRequired from '../../../hocs/loginRequired';
import { useRouter } from 'next/router';
import useWriteStoryInit from '../../../components/story/useWriteStoryInit';
import HaniStoryEditor from '../../../components/editor/HaniStoryEditor';
import {getOpenRangeOption} from "../../../src/lib/editor";

const UserTimelineWriteMobile: React.FC = React.memo(() => {
    const {query: {id}, asPath} = useRouter();
    const pathname = asPath.split('?')[0];

    const {
      defaultOpenRangeState: {defaultOpenRange},
      defaultAttachListState: {defaultAttachList, setDefaultAttachList},
      defaultDictListState: {defaultDictList, setDefaultDictList},
      defaultTagListState: {defaultTagList, setDefaultTagList},
    } = useWriteStoryInit();

    // Redux
    const {user_type} = useSelector(
      ({orm}) => pickUserSelector(id)(orm) || {} as any,
      (prev, curr) => isEqual(prev, curr),
    );
    const dispatch = useDispatch();

    // Api
    const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));

    // Life Cycle
    React.useEffect(() => {
      // 유저 리듀서의 정보를 가져옵니다.
      dispatch(fetchUserThunk(id));
    }, [id]);

    return (
      <HaniStoryEditor
        writeCallback={(result) => {
          dispatch(writeFeed({key: makeFeedKey(pathname), result}));
        }}
        defaultUserType={[user_type]}
        defaultOpenRange={defaultOpenRange}
        defaultAttachListState={{defaultAttachList, setDefaultAttachList}}
        defaultDictListState={{defaultDictList, setDefaultDictList}}
        defaultTagListState={{defaultTagList, setDefaultTagList}}
        writeStoryApi={formData => userApi.newStory(id, formData)}
        openRangeList={getOpenRangeOption(['human', 'user_all', 'only_me'])}
      />
    );
  },
);


UserTimelineWriteMobile.displayName = 'UserTimelineWriteMobile';
export default loginRequired(UserTimelineWriteMobile);

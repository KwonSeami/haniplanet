import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import CommunityBoard from '../CommunityBoard';
import {RootState} from '../../../src/reducers';

const LatestStory = () => {
  
  const latestStories = useSelector(
    ({community: {latest_stories}}: RootState) => latest_stories,
    shallowEqual
  );

  return (
    <div>
      <CommunityBoard
        title="최신 커뮤니티 글"
        data={latestStories}
      />
    </div>
  );
};

export default React.memo(LatestStory);

import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../src/reducers';
import CommunityMainBoard from '../CommunityMainBoard/index';

const FreeBoardStory = () => {
  // TODO: 임시로 비슷한 구조인 값을 불러왔으니, 변경해주세요.
  const latestFreeBoardStories = useSelector(
    ({community: {latest_free_board_stories}}: RootState) => latest_free_board_stories,
    shallowEqual
  );

  return (
    <CommunityMainBoard
      title="자유게시판 최근글"
      data={latestFreeBoardStories}
      className="free-board"
    />
  )
};

FreeBoardStory.displayName = 'FreeBoardStory';

export default React.memo(FreeBoardStory);
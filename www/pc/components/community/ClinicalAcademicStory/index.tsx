import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../src/reducers';
import CommunityMainBoard from '../CommunityMainBoard/index';

const ClinicalAcademicStory = () => {
  // TODO: 임시로 비슷한 구조인 값을 불러왔으니, 변경해주세요.
  const latestAcademicStories = useSelector(
    ({community: {latest_academic_stories}}: RootState) => latest_academic_stories,
    shallowEqual
  );

  return (
    <CommunityMainBoard
      title="임상/학술 최근글"
      data={latestAcademicStories}
    />
  )
};

ClinicalAcademicStory.displayName = 'ClinicalAcademicStory';

export default React.memo(ClinicalAcademicStory);
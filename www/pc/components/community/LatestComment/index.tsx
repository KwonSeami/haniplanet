import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import styled from 'styled-components';
import CommunityBoard from '../CommunityBoard';
import LatestCommentItem from './Item';
import {RootState} from '../../../src/reducers';

const Div = styled.div`
  .board {
    .content {
      padding: 4px 13px;
      box-sizing: border-box;
    }
  }
`;

const LatestComments = () => {
  const latestComments = useSelector(
    ({community: {latest_comments}}: RootState) => latest_comments,
    shallowEqual
  );

  return (
    <Div>
      <CommunityBoard
        title="최신 커뮤니티 댓글"
        data={latestComments}
        comp={LatestCommentItem}
      />
    </Div>
  );
};

export default React.memo(LatestComments);

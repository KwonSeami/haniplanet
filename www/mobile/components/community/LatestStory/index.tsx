import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import CommunityBoard from '../CommunityBoard';
import CommentItem from '../LatestComment/Item';
import {RootState} from '../../../src/reducers';

const LatestStory = () => {
  const [isComment, setIsComment] = React.useState(false);
  const {latest_stories, latest_comments} = useSelector(
    ({
      community: {
        latest_stories,
        latest_comments
      }
    }: RootState) => ({
      latest_stories,
      latest_comments
    }),
    shallowEqual
  );

  return (
    <>
      {isComment ? (
        <CommunityBoard
          title={(
            <>
              <h2>최신 커뮤니티</h2>
              <nav>
                <ul>
                  <li onClick={() => setIsComment(false)}>
                    글
                  </li>
                  <li className="active">
                    댓글
                  </li>
                </ul>
              </nav>
            </>
          )}
          data={latest_comments}
          comp={CommentItem}
        />
      ) : (
        <CommunityBoard
          title={(
            <>
              <h2>최신 커뮤니티</h2>
              <nav>
                <ul>
                  <li className="active">
                    글
                  </li>
                  <li onClick={() => setIsComment(true)}>
                    댓글
                  </li>
                </ul>
              </nav>
            </>
          )}
          data={latest_stories}
        />
      )}
    </>
  );
};

export default React.memo(LatestStory);

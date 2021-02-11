import React from 'react';
import CommunityBoard from '../CommunityBoard';
import {ICommunityStory} from '../../../src/reducers/community';

interface Props {
  data: [ICommunityStory[], ICommunityStory[]]
  writerName: string;
  user_expose_type: string;
}

const UserStory: React.FC<Props> = ({
  data,
  writerName,
  user_expose_type
}) => {
  const [isMine, setIsMine] = React.useState(user_expose_type !== 'real');
  const [pending, setPending] = React.useState(true);
  const [latest_stories, my_story_history] = data;

  // TODO: 잘못된 Dependency
  React.useEffect(() => {
    setPending(true);
    setTimeout(() => setPending(false),1);
  },[isMine]);

  if(pending) return '';
  return (
    <section>
      {isMine ? (
        <CommunityBoard
          title={(
            <>
              {user_expose_type === 'real' && (
                <p onClick={() => setIsMine(false)}>
                  {writerName}님의 최신글
                </p>
              )}
              <h2>내가 본 글</h2>
            </>
          )}
          data={my_story_history}
          isHistoryData
        />
      ) : (
        <CommunityBoard
          title={(
            <>
              <h2>
                <em>{writerName}</em>님의 최신글
              </h2>
              <p onClick={() => setIsMine(true)}>
                내가 본 글
              </p>
            </>
          )}
          data={latest_stories}
        />
      )}
    </section>
  );
};

export default React.memo(UserStory);

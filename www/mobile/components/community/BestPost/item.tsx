import * as React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {HashId} from '../../../../../packages/types';
import {staticUrl} from '../../../src/constants/env';
import {FeedGalleryLi} from '../detail';
import {timeSince} from '../../../src/lib/date';
import Link from 'next/link';

interface Props {
  id: HashId;
  ranking: number;
  title: string;
  tagName?: string;
  created_at: string;
  retrieve_count: number;
  comment_count: number;
  up_count: number;
  userType?: string;
}

const BestPostItem: React.FC<Props> = ({
  id,
  title,
  ranking,
  tagName,
  created_at,
  retrieve_count,
  comment_count,
  up_count,
  userType,
}) => {
  
  return (
    <FeedGalleryLi key={id}>
      <Link
        href="/community/[id]"
        as={`/community/${id}`}
      >
        <a>
          <div>
            <i
              className={userType}
            >
              {ranking}
            </i>
            {tagName && (
              <span className="tag">[{tagName}]</span>
            )}
            <h3>{title}</h3>
            <small>{timeSince(created_at)} · 조회 {retrieve_count} </small>
            <span className="icons">
              <span>
                <img 
                  src={staticUrl('/static/images/icon/icon-feed-like.png')}
                  alt="좋아요"
                />
                {up_count}
              </span>
              <span>
                <img 
                  src={staticUrl('/static/images/icon/icon-feed-comment.png')}
                  alt="댓글"
                />
                {comment_count}
            </span>
            </span>
          </div>
        </a>
      </Link>
    </FeedGalleryLi>
  )
};

BestPostItem.displayName = 'BestPostItem';

export default React.memo(BestPostItem);
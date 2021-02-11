import React from 'react';
import styled from 'styled-components';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {MainBoardWrapper, MainBoardHeader} from '../common';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY, $BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import CommunityBoardItem from '../CommunityBoard/Item';
import LatestCommentItem from '../LatestComment/Item';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import NoContentText from '../../NoContent/NoContentText';

const Div = styled(MainBoardWrapper)`
  header {
    ul {
      float: right;
      margin: 3px -8px 0 0;
      vertical-align: middle;

      li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin: 0 8px 0 9px;
        line-height: 16px;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
          color: $TEXT_GRAY
        })};
        border-bottom: 1px solid transparent;

        & ~ li::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -8px;
          transform: translateY(-50%);
          height: 9px;
          border-left: 1px solid ${$BORDER_COLOR};
        }

        &.on {
          color: ${$POINT_BLUE};
          border-bottom: 1px solid ${$POINT_BLUE};
        }
      }
    }
  }

  > div {
    width: 320px;
    height: 274px;

    &.story {
      padding: 12px 14px;
    }

    &.comment {
      padding: 8px 14px;

      > div {
        padding: 6px 0;

        h4 {
          margin-top: 2px;
        }
      }
    }

    .no-content {
      padding: 115px 0 0;

      p {
        font-size: 14px;
      }
    }
  }
`;

const MAX_STORIES_LENGTH = 8;
const MAX_COMMENTS_LENGTH = 5;

type TLatestType = 'story' | 'comment';

const LatestCommunity = () => {
  const [type, setType] = React.useState<TLatestType>('story');

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
    <Div>
      <MainBoardHeader>
        <h2>최신 커뮤니티</h2>
        <ul className="pointer">
          <li
            className={cn({on: type === 'story'})}
            onClick={() => setType('story')}
          >
            글
          </li>
          <li
            className={cn({on: type === 'comment'})}
            onClick={() => setType('comment')}
          >
            댓글
          </li>
        </ul>
      </MainBoardHeader>

      <div className={cn({
        story: type === 'story',
        comment: type === 'comment'
      })}>
        {type === 'story' ? (
          !isEmpty(latest_stories) ? (
            latest_stories.slice(0, MAX_STORIES_LENGTH).map(props => (
              <CommunityBoardItem
                key={props.id}
                {...props}
              />
            ))
          ) : (
            <NoContentText disabledImg>
              <p>등록 된 글이 없습니다.</p>
            </NoContentText>
          )
        ) : (
          !isEmpty(latest_comments) ? (
            latest_comments.slice(0, MAX_COMMENTS_LENGTH).map(props => (
              <LatestCommentItem
                key={props.id}
                {...props}
              />
            ))
          ) : (
            <NoContentText disabledImg>
              <p>등록 된 글이 없습니다.</p>
            </NoContentText>
          )
        )}
      </div>
    </Div>
  )
}

LatestCommunity.displayName = 'LatestCommunity';

export default React.memo(LatestCommunity);
import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../src/constants/env';
import {timeSince} from '../../src/lib/date';
import {under} from '../../src/lib/numbers';
import {$FONT_COLOR} from '../../styles/variables.types';
import MeetupBasicInfo from './extension/meetup/MeetupBasicInfo';
import {FeedTitle, InfoLi} from './common2';
import GuideLabel from "./branches/GuideLabel";
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {OverActionWrapper} from '../UI/OverAction';
import Avatar from '../Avatar';

const StyledFeedTitle = styled(FeedTitle)`
  overflow: hidden;

  & > h2 {
    display: block;
    white-space: nowrap;
    padding-right: 0;

    &.label-exist {
      padding-right: 93px;
    }
  }

  .guide-label {
    position: absolute;
    top: 15px;
    right: 0;
    height: 21px;
    margin: 0;
    line-height: 20px;
  }

  .attrs {
    li:first-child {
      ${fontStyleMixin({
        size: 14,
        weight: '600',
        color: $FONT_COLOR
      })}
    }

    .avatar {
      margin: 0;
    }
  }

  &.seminar-feed-wrapper {
    .attrs + ul {
      padding-bottom: 12px;
      margin-bottom: 0;
    }
  }
`;


const StoryReactionCount = styled.ul`
  li {
    display: inline-block;
    height: 25px;
    margin-right: 10px;
    ${fontStyleMixin({
      family: 'Montserrat',
      size: 15,
      weight: '300',
      color: $FONT_COLOR
    })}

    img {
      width: 24px;
      margin-right: 1px;
      margin-bottom: -5px;
    }
}
`;

const StorySimple = React.memo(props => {
  const {
    id,
    title,
    user,
    created_at,
    retrieve_count,
    up_count,
    down_count,
    comment_count,
    additional_data,
    stickers = [],
    isMeetup,
    user_types,
    extension,
    upCountOnly,
    onClick,
    user_expose_type,
    is_lecture,
  } = props;

  return (
    <OverActionWrapper
      onClick={() => {
        if (is_lecture) {
          window.open(`/story/${id}`, '_blank');
        } else {
          onClick();
        }
      }}
    >
      <StyledFeedTitle
        user={user}
        className={cn({
          'seminar-feed-wrapper': !!isMeetup
        })}
      >
        <h2 className={cn({'label-exist': stickers.length > 0})}>
          {title}
        </h2>
        {stickers.map(props => (
          <GuideLabel
            className="guide-label"
            {...props}
          />
        ))}
        <ul className="attrs">
          {user && (
            <InfoLi>
              <Avatar
                name={user.name || '익명의 유저'}
                userExposeType={user_expose_type}
                isImg={false}
                {...user}
              />
            </InfoLi>
          )}
          <InfoLi>
            {timeSince(created_at)}&nbsp;·
          </InfoLi>
          <InfoLi>
            조회 {under(retrieve_count)}
          </InfoLi>
        </ul>
        {isMeetup && (
          <MeetupBasicInfo
            user_types={user_types}
            {...extension}
          />
        )}
        <StoryReactionCount>
          <li>
            <img
              src={staticUrl('/static/images/icon/icon-like.png')}
              alt="좋아요"
            />
            {up_count}
          </li>
          {!upCountOnly && (
            <>
              <li>
                <img
                  src={staticUrl('/static/images/icon/icon-unlike.png')}
                  alt="별로예요"
                />
                {down_count}
              </li>
              <li>
                <img
                  src={staticUrl('/static/images/icon/icon-comment.png')}
                  alt="댓글"
                />
                {comment_count}
              </li>
            </>
          )}
        </StoryReactionCount>
      </StyledFeedTitle>
    </OverActionWrapper>
  );
});

StorySimple.displayName = 'StorySimple';
export default StorySimple;

import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../src/constants/env';
import {timeSince} from '../../src/lib/date';
import {under} from '../../src/lib/numbers';
import {$FONT_COLOR} from '../../styles/variables.types';
import {FeedTitle, InfoLi, StoryLabelP} from './common';
import GuideLabel from "./branches/GuideLabel";
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {OverActionWrapper} from '../UI/OverAction';
import Avatar from '../Avatar';
import TextLabel from '../UI/tag/TextLabel';
import {USER_TYPE_TO_KOR} from '../../src/constants/users';
import StoryThumbnailImg from "./StoryThumbnailImg";
import {DAY} from '../../src/constants/times';
import isEmpty from 'lodash/isEmpty';
import {checkOnlinePage} from '../../src/lib/community';

const StyledFeedTitle = styled(FeedTitle)`
  overflow: hidden;

  &.thumbnail-img {
    padding-right: 88px;
  }

  .attrs {
    margin-top: 2px;
  }
`;

const StoryReactionCount = styled.ul`
  padding-top: 6px;

  li {
    display: inline-block;
    margin-right: 5px;
    ${fontStyleMixin({
      family: 'Montserrat',
      size: 12,
      weight: '300',
      color: $FONT_COLOR
    })}
    opacity: 0.6;

    img {
      vertical-align: middle;
      width: 14px;
      margin: -3px 2px 0 0;
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
    stickers = [],
    isMeetup,
    onClick,
    user_expose_type,
    images,
    video,
    is_notice,
    extend_to,
    menu_tag,
    allowDetail,
  } = props;

  const checkOnlineTagName = checkOnlinePage(menu_tag?.name);

  const TitleLabel = React.useCallback<React.FC>(() => {
    if (is_notice) {
      return <StoryLabelP>공지사항</StoryLabelP>;
    }

    switch (extend_to) {
      case 'meetup':
        return <StoryLabelP>세미나/모임</StoryLabelP>;
      default:
        return null;
    }
  }, [is_notice, extend_to]);

  const imgLength = images ? images.length : 0;

  const now = new Date().getTime();
  const createdAt = new Date(created_at).getTime();
  const isNew = (now - createdAt) < DAY;

  return (
    <OverActionWrapper
      className={cn({simple: !allowDetail})}
      onClick={onClick}
    >
      <StyledFeedTitle
        user={user}
        className={cn({
          'seminar-feed-wrapper': !!isMeetup,
          'thumbnail-img': !!imgLength || video
        })}
      >
        {(!!imgLength || video) && (
          <StoryThumbnailImg
            video={video}
            images={images}
            size={{width: 68, height: 68}}
            position={{top: 14, side: 'right'}}
            childrenSize={28}
            fontSize={10}
            playImgSize={26}
          />
        )}
        <TitleLabel />
        <div className={cn('title', {'label-exist': stickers.length > 0})}>
          <h2>
            {(!isEmpty(menu_tag) && menu_tag.name) && (
              <span>[{menu_tag.name}]</span>
            )}
            {title}
          </h2>
          {isNew && (
            <img
              src={staticUrl('/static/images/icon/icon-new.png')}
              alt="new"
            />
          )}
          {stickers.map(({additional_data, ...props}) => (
            <GuideLabel
              className={cn('pointer')}
              bgColor={additional_data.bcColor}
              {...props}
            />
          ))}
        </div>
        <ul className="attrs">
          <InfoLi>
            <Avatar
              name={user?.name || '익명의 유저'}
              userExposeType={user_expose_type}
              hideImage
              {...user}
            />
          </InfoLi>
          {user && user.user_type && (
            <InfoLi>
              <TextLabel
                name={USER_TYPE_TO_KOR[user.user_type]}
                color={user.user_type === 'doctor' ? '#7fc397' : '#9586d0'}
              />
            </InfoLi>
          )}
          <InfoLi>
            {timeSince(created_at)}&nbsp;·
          </InfoLi>
          <InfoLi>
            조회 {under(retrieve_count, 9999)}
          </InfoLi>
        </ul>
        <StoryReactionCount>
          <li>
            <img
              src={staticUrl('/static/images/icon/icon-feed-like.png')}
              alt="좋아요"
            />
            {up_count}
          </li>
          {!checkOnlineTagName && (
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-feed-unlike.png')}
                alt="별로예요"
              />
              {down_count}
            </li>
          )}
          <li>
            <img
              src={staticUrl('/static/images/icon/icon-feed-reply.png')}
              alt="댓글"
            />
            {comment_count}
          </li>
        </StoryReactionCount>
      </StyledFeedTitle>
    </OverActionWrapper>
  );
});

StorySimple.displayName = 'StorySimple';
export default StorySimple;

import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../src/constants/env';
import {timeSince} from '../../src/lib/date';
import {under} from '../../src/lib/numbers';
import {FeedTitle, InfoLi, StoryLabelP, CenterWrapper} from './common';
import GuideLabel from "./branches/GuideLabel";
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import Avatar from '../Avatar';
import {USER_TYPE_TO_KOR} from '../../src/constants/users';
import TextLabel from '../UI/tag/TextLabel';
import StoryThumbnailImg from './StoryThumbnailImg';
import {DAY} from '../../src/constants/times';
import isEmpty from 'lodash/isEmpty';
import { checkOnlinePage } from '../../src/lib/community';

const StyledFeedTitle = styled(FeedTitle)`
  border-bottom: 1px solid #f2f3f7;
  overflow: hidden;

  .thumbnail-img {
    padding-right: 85px;

    @media screen and (max-width: 680px) {
      .story-thumbnail-img {
        right: 15px;
      }
    }
  }

  ${StoryLabelP} {
    margin-top: -2px;
  }
`;

const StoryReactionCount = styled.ul`
  padding-top: 3px;

  li {
    display: inline-block;
    margin-right: 4px;
    ${fontStyleMixin({
      family: 'Montserrat',
      size: 12,
      weight: '300'
    })};
    opacity: 0.6;

    img {
      width: 14px;
      margin: 0 2px -3px 0;
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
    upCountOnly,
    onClick,
    user_expose_type,
    is_notice,
    extend_to,
    images,
    video,
    menu_tag
  } = props;

  const checkOnlineTagName = checkOnlinePage(menu_tag?.name);

  const now = new Date().getTime();
  const createdAt = new Date(created_at).getTime();
  const isNew = (now - createdAt) < DAY;

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

  return (
    <StyledFeedTitle
      user={user}
      onClick={onClick}
      className="story-simple"
    >
      <CenterWrapper className={cn({'thumbnail-img': !!imgLength || video})}>
        {(!!imgLength || video) && (
          <StoryThumbnailImg
            backgroundImg
            video={video}
            images={images}
            size={{width: '56px', height: '56px'}}
            position={{top: 14, side: 'right'}}
            childrenSize={22}
            fontSize={10}
            playImgSize={26}
          />
        )}
        <TitleLabel />
        <div className={cn('title', {
          'label-exist': stickers.length > 0,
          new: isNew
        })}>
          <h2>
            {(!isEmpty(menu_tag) && menu_tag.name) && (
              <span>[{menu_tag.name}]</span>
            )}
            {title}
          </h2>
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
              isImg={false}
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
            {timeSince(created_at)}&nbsp;· 조회 {under(retrieve_count, 9999)}
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
          {!upCountOnly && (
            <>
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
            </>
          )}
        </StoryReactionCount>
      </CenterWrapper>
    </StyledFeedTitle>
  );
});

StorySimple.displayName = 'StorySimple';

export default StorySimple;

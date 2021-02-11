import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../../../src/constants/env';
import {timeSince} from '../../../../src/lib/date';
import {under, numberWithCommas} from '../../../../src/lib/numbers';
import {$POINT_BLUE} from '../../../../styles/variables.types';
import {FeedTitle, InfoLi, StoryLabelP} from '../../common';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {OverActionWrapper} from '../../../UI/OverAction';
import Avatar from '../../../Avatar';
import StoryReaction from '../../StoryReaction';
import Tag from '../../../UI/tag/Tag';
import {useRouter} from "next/router";
import TextLabel from '../../../UI/tag/TextLabel';
import {USER_TYPE_TO_KOR} from '../../../../src/constants/users';
import GuideLabel from '../GuideLabel';
import StoryThumbnailImg from '../../StoryThumbnailImg';
import {StoryBlind} from '../../StoryBlind';
import {DAY} from '../../../../src/constants/times';
import isEmpty from 'lodash/isEmpty';
import {checkOnlinePage} from '../../../../src/lib/community';

const StyledFeedTitle = styled(FeedTitle)`
  padding-bottom: 20px;
  overflow: hidden;

  &.Thumbnail-img {
    min-height: 168px;
    padding-right: 146px;

    .contents {
      padding-bottom: 40px;
    }

    .info-bot-box {
      position: absolute;
      bottom: 19px;
      width: calc(100% - 146px);
    }
  }

  .contents {

    .blind {
      padding: 7px 0 2px;
      text-align: left;

      img {
        vertical-align: middle;
        width: 16px;
        height: 14px;
      }

      p {
        display: inline-block;
        vertical-align: middle;
        margin: 0 0 0 6px;
      }
    }
  }

  .info-bot-box {
    display: table;
    width: 100%;
    padding-top: 21px;

    > .icon-box {
      display: table-cell;
      text-align: right;
      font-size: 0;

      .pointer {
        display: inline-block;
        vertical-align: middle;
      }

      .point {
        display: inline-block;
        vertical-align: middle;

        img {
          vertical-align: middle;
          width: 15px;
          margin: 0 2px 0 6px;
          padding: 1px 1px 2px 2px;
        }

        span {
          display: inline-block;
          vertical-align: middle;
          ${fontStyleMixin({
            size: 13,
            weight: '300',
            color: $POINT_BLUE,
            family: 'Montserrat'
          })};
        }
      }
    }
  }
`;

const StoryDetailCard = props => {
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
    isWriter,
    is_follow,
    reaction_type,
    can_comment,
    can_reaction,
    can_follow,
    waterMarkProps,
    open_range,
    images,
    summary,
    tags,
    highlightKeyword,
    received_point,
    video,
    is_notice,
    extend_to,
    status,
    blind_reason,
    menu_tag,
    has_my_comments,
    allowDetail
  } = props;
  const router = useRouter();

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

  // 블라인드 boolean
  const isBlind = status === 'blinded';

  return (
    <OverActionWrapper
      onClick={onClick}
      className={cn({simple: !allowDetail})}
    >
      <StyledFeedTitle
        user={user}
        className={cn({
          'seminar-feed-wrapper': !!isMeetup,
          'Thumbnail-img': !!imgLength || video
        })}
      >
        {/* Vimeo, Youtube Thumnail 생성 API 적용 */}
        {(!!imgLength || video) && (
          <StoryThumbnailImg
            video={video}
            images={images}
            position={{top: 18, side: 'right'}}
            size={{width: 132, height: 132}}
            childrenSize={31}
            fontSize={14}
            playImgSize={38}
          />
        )}
        <div className={cn('contents')}>
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
          {isBlind ? (
            <StoryBlind reason={blind_reason} />
          ) : (
            <p>{summary}</p>
          )}
          <ul className="tag">
            {tags && tags.map(({id, name, is_follow}) => (
              <li key={id} style={{display: 'inline-block'}}>
                <Tag
                  name={name}
                  highlighted={is_follow}
                  textHighlighted={highlightKeyword === name}
                  onClick={e => {
                    e.stopPropagation();
                    router.push(`/tag/${id}`)
                  }}
                />
              </li>
            ))}
          </ul>
          <div className="info-bot-box">
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
                {timeSince(created_at)}&nbsp;·
              </InfoLi>
              <InfoLi>
                조회 {under(retrieve_count, 9999)}
              </InfoLi>
            </ul>
            <div className="icon-box">
              <StoryReaction
                storyPk={id}
                storyUser={user}
                up_count={up_count}
                down_count={down_count}
                comment_count={comment_count}
                is_writer={isWriter}
                is_follow={is_follow}
                reaction_type={reaction_type}
                can_comment={can_comment}
                can_reaction={can_reaction}
                can_follow={can_follow}
                user_expose_type={user_expose_type}
                not_text
                blockReaction
                isPreview
                has_my_comments={has_my_comments}
                // for watermark
                open_range={open_range}
                waterMarkProps={waterMarkProps}
                is_online_community={checkOnlineTagName}
                disableReactions={!allowDetail}
              />
              <div className="point">
                <img
                  src={staticUrl('/static/images/icon/icon-point.png')}
                  alt="받은 별"
                />
                <span>{numberWithCommas(received_point)}</span>
              </div>
            </div>
          </div>
        </div>
      </StyledFeedTitle>
    </OverActionWrapper>
  );
};

StoryDetailCard.displayName = 'StoryDetailCard';
export default StoryDetailCard;

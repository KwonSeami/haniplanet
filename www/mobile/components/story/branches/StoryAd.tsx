import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import * as React from 'react';
import StoryLabelCard from '../../UI/Card/StoryLabelCard';
import cn from 'classnames';
import {staticUrl} from '../../../src/constants/env';
import {toDateFormat} from '../../../src/lib/date';
import Tag from '../../UI/tag/Tag';
import StoryReaction from '../StoryReaction2';
import A from '../../UI/A';
import {useRouter} from "next/router";

export const FeedTitle = styled.div`
  position: relative;
  padding: 15px 0 16px;
  margin: 0 15px;

  & > h2 {
    padding: 0 70px 0 40px;
    ${fontStyleMixin({
      size: 16,
      weight: 'bold',
    })}
    
    span {
      position: absolute;
      top: 18px;
      left: 0;
      margin-right: 7px;
      display: inline-block;
      vertical-align: middle;
      padding: 2px 6px;
      background-color: #f6f7f9;
      ${fontStyleMixin({
        size: 11,
        weight: '600',
        color: '#999',
      })}
    }
  }

  ul {
    padding-top: 6px;

    li {
      position: relative;
      margin-top: 2px;
      padding-right: 4px;
      display: inline-block;
      vertical-align: middle;
      font-size: 12px;
      color: ${$TEXT_GRAY};
    }
  }
`;

const PreviewDiv = styled.div`
  position: relative;

  span {
    display: block;
    position: absolute;
    right: 10px;
    bottom: 13px;
    ${fontStyleMixin({
      size: 12,
      color: $WHITE,
      weight: 'bold',
    })}

    img {
      width: 12px;
      margin: 0 0 -2px 4px;
    }
  }
`;
const StoryAd = React.memo<IStory>((
  {
    className,
    id,
    user,
    up_count,
    down_count,
    comment_count,
    reaction_type,
    title,
    created_at,
    retrieve_count,
    tags,
    highlightKeyword,
    can_comment,
    can_reaction,
    can_follow,
    can_reply,
    url_card,
    has_my_comments,
    extension: {
      mobile_image,
    },
  },
) => {
  const router = useRouter();

  const inner = (
    <>
    <img src={mobile_image} alt="광고 배너"/>
    
      <span>
        더 알아보기
        <img
          src={staticUrl('/static/images/icon/arrow/icon-white-arrow.png')}
          alt="더 알아보기"
        />
      </span>
    </>
  );
  return (
    <StoryLabelCard className={cn('no-select', className)}>
      <FeedTitle>
        <h2>
          <span>광고</span>
            {title}
        </h2>
        <ul>
          <li>{toDateFormat(created_at, 'YY.MM.DD HH:mm')}&nbsp;·</li>
          <li>조회 {retrieve_count}</li>
        </ul>
      </FeedTitle>

      <PreviewDiv>
        {url_card ? (
          <A to={url_card.url} newTab>{inner}</A>
        ) : (
          inner
        )}
      </PreviewDiv>

      <ul className="tag">
        {tags && tags.map(({id, name, is_follow}) => (
          <li key={id} style={{display: 'inline-block'}}>
            <Tag
              name={name}
              highlighted={is_follow}
              textHighlighted={highlightKeyword === name}
              onClick={() => router.push(`/tag/${id}`)}
            />
          </li>
        ))}
      </ul>
      <StoryReaction
        storyPk={id}
        storyUser={user}
        up_count={up_count}
        down_count={down_count}
        comment_count={comment_count}
        is_writer={false}
        is_follow={false}
        can_comment={can_comment}
        can_reaction={can_reaction}
        can_follow={can_follow}
        can_reply={can_reply}
        reaction_type={reaction_type}
        has_my_comments={has_my_comments}
      />
    </StoryLabelCard>
  );
});

StoryAd.displayName = 'StoryAd';
export default StoryAd;


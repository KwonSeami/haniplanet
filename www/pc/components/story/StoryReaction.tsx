import * as React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {$GRAY} from '../../styles/variables.types';
import {fontStyleMixin, inlineBlockMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {useDispatch} from 'react-redux';
import {toggleStoryReactionThunk, toggleFollowStoryThunk} from '../../src/reducers/orm/story/thunks';
import {under} from '../../src/lib/numbers';
import {CountName} from './common';
import cn from 'classnames';
import {useRouter} from "next/router";
import DefaultCommentArea from "../comment/DefaultCommentArea";
import WaterMark from "../watermark";

interface Props {
  storyPk: HashId;
  up_count: number;
  down_count: number;
  comment_count: number;
  is_writer: boolean;
  reaction_type: TReactionType;
  can_comment: boolean;
  can_reaction: boolean;
  can_follow: boolean;
  can_reply: boolean;
  variant?: string;
  not_text: boolean;
  on: string;
  has_my_comments: boolean;
  is_online_community?: boolean;
  disableReactions?: boolean;
  can_save?: boolean;
  openComment?: boolean;
  placeholder?: string;
}

export const UserButtonList = styled.ul<Pick<Props, 'is_writer' | 'disableReactions'>>`
  box-sizing: border-box;

  & > li {
    position: relative;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    cursor: default;

    img {
      ${inlineBlockMixin(18)};
    }

    p {
      display: inline-block;
      vertical-align: middle;
      margin-left: 2px;
      ${fontStyleMixin({
        size: 13,
        weight: '500',
        color: $GRAY
      })}
    }

    &.save p {
      margin-top: -1px;
    }
  
    span {
      display: inline-block;
      vertical-align: middle;
      margin: -2px 0 0 2px;
      ${fontStyleMixin({
        size: 16,
        weight: '300',
        family: 'Montserrat',
      })}
    }

    & ~ li img {
      margin-left: 12px;
    }

    &:active {
      opacity: 0.4;
    }

    ${({disableReactions}) => !disableReactions && (`
      &:hover {
        text-decoration: underline;
        cursor: pointer;
  
        span {
          text-decoration: underline;
        }
      }
    `)};
  }

  &.not-text li {
    img {
      margin-left: 6px;
    }

    span {
      vertical-align: baseline;
      margin-left: 0;
      font-size: 13px;
    }
  }
`;

const StoryReaction = React.memo<Props>((
  {
    storyPk,
    storyUser,
    up_count,
    down_count,
    comment_count,
    reaction_type,
    is_writer,
    is_follow,
    can_comment,
    can_reaction,
    can_follow,
    children,
    className,
    can_save,
    openComment,
    open_range,
    user_expose_type,
    // inject
    waterMarkProps,
    isMeetup,
    variant,
    not_text,
    blockReaction,
    placeholder,
    isPreview,
    has_my_comments,
    is_online_community,
    disableReactions = false,
  },
) => {
  const [viewComment, setViewComment] = React.useState(openComment);
  const access = useSelector(({system: {session: {access}}}) => access);
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!!access && !viewComment && !isPreview) {
      setViewComment(curr => !curr);
    }
  }, [access, viewComment, isPreview]);

  return (
    <div className={cn('pointer reaction', className)}>
      <UserButtonList
        is_writer={is_writer}
        className={cn({'not-text': not_text})}
        disableReactions={disableReactions}
      >
        {children}
        {can_reaction && ( // !!! 리액션 별로 따로 묶어야됨 스타일이 깨지지 않음. 아래 리액션과 조건을 합치면 안됨.
          <li onClick={e => {
              if (!disableReactions) {
                blockReaction && e.stopPropagation();
                dispatch(toggleStoryReactionThunk(storyPk, 'up'))
              }
            }}
          >
            <img
              src={staticUrl(`/static/images/icon/icon-feed-like${(reaction_type === 'up') ? '-on' : ''}.png`)}
              alt="좋아요"
            />
            <CountName on={reaction_type === 'up'}>
              {!not_text && ('좋아요')}
              <span>{under(up_count)}</span>
            </CountName>
          </li>
        )}
        {(can_reaction && !isMeetup && !is_online_community) && (
          <li onClick={e => {
              if (!disableReactions) {
                blockReaction && e.stopPropagation();
                dispatch(toggleStoryReactionThunk(storyPk, 'down'))
              }
            }}
          >
            <img
              src={staticUrl(`/static/images/icon/icon-feed-unlike${(reaction_type === 'down') ? '-on' : ''}.png`)}
              alt="별로예요"
            />
            <CountName on={reaction_type === 'down'}>
              {!not_text && ('별로예요')}
              <span>{under(down_count)}</span>
            </CountName>
          </li>
        )}
        {viewComment && (
          <li
            onClick={() => {
              if (!disableReactions) {
                if (!!access) {
                  setViewComment(current => !current);
                } else {
                  confirm('글에 대한 액션은 로그인 후 가능합니다. 로그인 페이지로 이동하시겠습니까?') && router.push('/login');
                }
              }
            }}
          >
            <img
              src={staticUrl(`/static/images/icon/icon-feed-reply${has_my_comments ? '-on' : ''}.png`)}
              alt="댓글"
            />
            <CountName on={has_my_comments}>
              {!not_text && ('댓글')}
              <span>{under(comment_count)}</span>
            </CountName>
          </li>
        )}
        {(can_follow && !is_writer && !not_text && !!can_save) && (
          <li
            className={cn('save', variant)}
            onClick={e => {
              if (!disableReactions) {
                if (!!access) {
                  blockReaction && e.stopPropagation();
                  dispatch(toggleFollowStoryThunk(storyPk));
                } else {
                  confirm('글에 대한 액션은 로그인 후 가능합니다. 로그인 페이지로 이동하시겠습니까?') && router.push('/login');
                }
              }
            }}
          >
            <img
              src={staticUrl(`/static/images/icon/icon-feed-save${is_follow ? '-on' : ''}.png`)}
              alt="저장"
            />
            {!not_text && (
              <p>{variant === 'meetup' ? '즐겨찾기' : '저장하기'}</p>
            )}
          </li>
        )}
      </UserButtonList>
      {viewComment && (
        waterMarkProps && open_range !== 'human' ? (
          <WaterMark {...waterMarkProps}>
            <DefaultCommentArea
              // caption="파일을 올려주세요"
              can_comment={can_comment}
              targetPk={storyPk}
              targetName="story"
              placeholder={placeholder}
              maxDepth={1}
              targetUserExposeType={user_expose_type}
            />
          </WaterMark>
        ) : (
          <DefaultCommentArea
            // caption="파일을 올려주세요"
            targetPk={storyPk}
            targetName="story"
            placeholder={placeholder}
            maxDepth={1}
            targetUserExposeType={user_expose_type}
          />
        ))}
    </div>
  );
});

export default StoryReaction;

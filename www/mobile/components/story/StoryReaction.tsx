import * as React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {$GRAY} from '../../styles/variables.types';
import {fontStyleMixin, inlineBlockMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {useDispatch} from 'react-redux';
import {toggleStoryReactionThunk, toggleFollowStoryThunk, increaseRetrieveCountThunk} from '../../src/reducers/orm/story/thunks';
import {under} from '../../src/lib/numbers';
import {CountSpan} from './common';
import cn from 'classnames';
import {useRouter} from "next/router";
import DefaultCommentArea from "../comment/DefaultCommentArea";
import WaterMark from "../watermark";

export const UserButtonList = styled.ul<Pick<Props, 'is_writer'>>`
  width: 100%;
  padding: 14px 0;
  font-size: 0;
  border-top: 1px solid #eee;
  box-sizing: border-box;

  @media screen and (max-width: 680px) {
    padding: 14px 15px;
  }

  li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    font-size: 0;
    box-sizing: border-box;
    cursor: pointer;

    img {
      ${inlineBlockMixin(20)};
      margin-right: 4px;
    }

    p {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        color: $GRAY,
      })};
    }

    span {
      display: inline-block;
      vertical-align: middle;
      margin-right: 12px;
      ${fontStyleMixin({
        size: 14,
        weight: '300',
        family: 'Montserrat',
      })}
    }
  }
`;

interface Props {
  storyPk: HashId;
  up_count: number;
  down_count: number;
  comment_count: number;
  is_writer: boolean;
  isPreview: boolean;
  reaction_type: TReactionType;
  can_comment: boolean;
  can_save: boolean;
  can_reaction: boolean;
  openComment?: boolean;
  can_follow: boolean;
  can_reply: boolean;
  variant?: string;
  has_my_comments: boolean;
  is_online_community?: boolean;
  placeholder?: string;
}

const StoryReaction = React.memo<Props>((
  {
    storyPk,
    storyUser,
    up_count,
    down_count,
    comment_count,
    reaction_type,
    is_writer,
    isPreview,
    is_follow,
    can_comment,
    can_reaction,
    can_follow,
    children,
    className,
    can_save,
    open_range,
    user_expose_type,
    has_my_comments,
    openComment,
    // inject
    waterMarkProps,
    isMeetup,
    variant,
    is_online_community,
    placeholder
  },
) => {
  const access = useSelector(({system: {session: {access}}}) => access);
  const router = useRouter();
  const dispatch = useDispatch();
  const {asPath} = router;

  const [viewComment, setViewComment] = React.useState(openComment || (asPath || '').includes('comment'));

  React.useEffect(() => {
    if (!!access) {
      setViewComment(() => !isPreview);
    }
  }, [access, isPreview]);

  return (
    <div className={cn('pointer reaction', className)}>
      <UserButtonList is_writer={is_writer}>
        {children}
        {can_reaction && ( // !!! 리액션 별로 따로 묶어야됨 스타일이 깨지지 않음. 아래 리액션과 조건을 합치면 안됨.
          <li onClick={() => dispatch(toggleStoryReactionThunk(storyPk, 'up'))}>
            <img
              src={staticUrl(`/static/images/icon/icon-feed-like${(reaction_type === 'up') ? '-on' : ''}.png`)}
              alt="좋아요"
            />
            <CountSpan on={reaction_type === 'up'}>{under(up_count)}</CountSpan>
          </li>
        )}
        {can_reaction && !isMeetup && !is_online_community && (
          <li onClick={() => dispatch(toggleStoryReactionThunk(storyPk, 'down'))}>
            <img
              src={staticUrl(`/static/images/icon/icon-feed-unlike${(reaction_type === 'down') ? '-on' : ''}.png`)}
              alt="별로예요"
            />
            <CountSpan on={reaction_type === 'down'}>{under(down_count)}</CountSpan>
          </li>
        )}
        {viewComment && (
          <li
            onClick={() => {
              if (!!access) {
                setViewComment(current => !current);
                !viewComment && dispatch(increaseRetrieveCountThunk(storyPk));

              } else {
                confirm('글에 대한 액션은 로그인 후 가능합니다. 로그인 페이지로 이동하시겠습니까?') && router.push('/login');
              }
            }}
          >
            <img
              src={staticUrl(`/static/images/icon/icon-feed-reply${has_my_comments ? '-on' : ''}.png`)}
              alt="댓글"
            />
            <CountSpan on={has_my_comments}>
              {under(comment_count)}
            </CountSpan>
          </li>
        )}
        {(can_save && can_follow && !is_writer) && (
          <li
            className={cn("share", {on: is_follow}, variant)}
            onClick={() => {
              if (!!access) {
                dispatch(toggleFollowStoryThunk(storyPk));
              } else {
                confirm('글에 대한 액션은 로그인 후 가능합니다. 로그인 페이지로 이동하시겠습니까?') && router.push('/login');
              }
            }}
          >
            <img
              src={staticUrl(`/static/images/icon/icon-feed-save${is_follow ? '-on' : ''}.png`)}
              alt="저장"
            />
            <p>{variant === 'meetup' ? '즐겨찾기' : '저장하기'}</p>
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
              maxDepth={1}
              placeholder={placeholder}
              targetUserExposeType={user_expose_type}
            />
          </WaterMark>
        ) : (
          <DefaultCommentArea
            // caption="파일을 올려주세요"
            targetPk={storyPk}
            targetName="story"
            maxDepth={1}
            placeholder={placeholder}
            targetUserExposeType={user_expose_type}
          />
        ))}
    </div>
  );
});

export default StoryReaction;

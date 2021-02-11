import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE} from '../../styles/variables.types';
import {fontStyleMixin, inlineBlockMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {useDispatch} from 'react-redux';
import {toggleStoryReactionThunk, toggleFollowStoryThunk, increaseRetrieveCountThunk} from '../../src/reducers/orm/story/thunks';
import {under} from '../../src/lib/numbers';
import {CountSpan} from './common2';
import {useRouter} from "next/router";
import DefaultCommentArea from "../comment/DefaultCommentArea";
import WaterMark from "../watermark";

export const UserButtonList = styled.ul<Pick<Props, 'is_writer'>>`
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};

  & > li {
    position: relative;
    width: ${({children}) => Array.isArray(children) 
    ? 100 / children.reduce((prev, r) => !!r ? prev + 1 : prev, 0)
    : 100}%;
    padding: 14px 17px 15px;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    cursor: pointer;
    ${fontStyleMixin({
      size: 13,
      color: $GRAY,
    })};

    &::after {
      content: '';
      position: absolute;
      top: 17px;
      right: 0;
      width: 1px;
      height: 21px;
      background-color: ${$BORDER_COLOR};
    }

    &:last-child::after {
      display: none;
    }

    &:hover {
      text-decoration: underline;

      span {
        text-decoration: underline;
      }
    }

    &.share {
      text-align: center;

      &.meetup {
        color: #000 !important;
      }
      
      &.on {
        color: ${$POINT_BLUE} !important;
      }
      &.meetup.on {
        color: #000 !important;
      }
    }

    img {
      ${inlineBlockMixin(24)};
      margin: -2px 1px 0 0;
    }

    p {
      display: inline-block;
      vertical-align: middle;
    }
  
    span {
      position: absolute;
      right: 20px;
      top: 16px;
      ${fontStyleMixin({
        size: 17,
        family: 'Montserrat',
      })}
    }

    &:active {
      opacity: 0.4;
    }
  }
`;

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
  isPreview: boolean;
  variant?: string;
  has_my_comments: boolean;
}

const StoryReaction2 = React.memo<Props>((
  {
    storyPk,
    storyUser,
    up_count,
    down_count,
    comment_count,
    reaction_type,
    is_writer,
    is_follow,
    isPreview,
    can_comment,
    can_reaction,
    can_follow,
    children,
    className,
    open_range,
    user_expose_type,
    has_my_comments,
    // inject
    waterMarkProps,
    isMeetup,
    variant
  },
) => {
  const router = useRouter();
  const {asPath} = router;
  const dispatch = useDispatch();
  const [viewComment, setViewComment] = React.useState((asPath || '').includes('comment'));
  const access = useSelector(({system: {session: {access}}}) => access);

  React.useEffect(() => {
    if (!!access && !viewComment && !isPreview) {
      setViewComment(curr => !curr);
    }
  }, [access, viewComment, isPreview]);

  return (
    <div className={className}>
      <UserButtonList is_writer={is_writer}>
        {children}
        {can_reaction && ( // !!! 리액션 별로 따로 묶어야됨 스타일이 깨지지 않음. 아래 리액션과 조건을 합치면 안됨.
          <li onClick={() => dispatch(toggleStoryReactionThunk(storyPk, 'up'))}>
            <img
              src={staticUrl('/static/images/icon/icon-like.png')}
              alt="좋아요"
            />
            <p>좋아요</p>
            <CountSpan on={reaction_type === 'up'}>{under(up_count)}</CountSpan>
          </li>
        )}
        {can_reaction && !isMeetup && (
          <li onClick={() => dispatch(toggleStoryReactionThunk(storyPk, 'down'))}>
            <img
              src={staticUrl('/static/images/icon/icon-unlike.png')}
              alt="별로예요"
            />
            <p>별로예요</p>
            <CountSpan on={reaction_type === 'down'}>{under(down_count)}</CountSpan>
          </li>
        )}
        {can_comment && (
          <li
            onClick={() => {
              if (!!access) {
                setViewComment(curr => !curr);
                !viewComment && dispatch(increaseRetrieveCountThunk(storyPk));
              } else {
                confirm('글에 대한 액션은 로그인 후 가능합니다. 로그인 페이지로 이동하시겠습니까?') && router.push('/login');
              }
            }}
          >
            <img
              src={staticUrl('/static/images/icon/icon-reply.png')}
              alt="댓글"
            />
            <p>댓글</p>
            <CountSpan on={has_my_comments}>
              {under(comment_count)}
            </CountSpan>
          </li>
        )}
        {(can_follow && !is_writer) && (
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
            {is_follow ? (
              <img
                src={variant === 'meetup' ? staticUrl('/static/images/icon/icon-heart-fill.png') : staticUrl('/static/images/icon/icon-save-on.png')}
                alt="저장 취소"
              />
            ) : (
              <img
                src={variant === 'meetup' ? staticUrl('/static/images/icon/icon-heart-border.png') : staticUrl('/static/images/icon/icon-save.png')}
                alt="저장"
              />
            )}
            {variant === 'meetup' ? '즐겨찾기' : '저장'}
          </li>
        )}
      </UserButtonList>
      {(can_comment && viewComment) && (
        waterMarkProps && open_range !== 'human' ? (
          <WaterMark {...waterMarkProps}>
            <DefaultCommentArea
              // caption="파일을 올려주세요"
                targetPk={storyPk}
                targetName="story"
                maxDepth={1}
                targetUserExposeType={user_expose_type}
            />
          </WaterMark>
        ) : (
          <DefaultCommentArea
            // caption="파일을 올려주세요"
            targetPk={storyPk}
            targetName="story"
            maxDepth={1}
            targetUserExposeType={user_expose_type}
          />
        ))}
    </div>
  );
});

export default StoryReaction2;

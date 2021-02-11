import * as React from 'react';
import styled, { keyframes } from 'styled-components'
import { $WHITE, $GRAY, $BORDER_COLOR } from '../../../styles/variables.types';
import { staticUrl } from '../../../src/constants/env';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { toggleStoryReactionThunk, toggleFollowStoryThunk } from '../../../src/reducers/orm/story/thunks';
import { useRouter } from 'next/router';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';

const scale = keyframes`
  from {
    transform: scale(1.15);
  }

  to {
    transform: scale(1);
  }
`;


const WrappperDiv = styled.div`
  width: 67px;

  & > div {
    color: ${$GRAY};
    border-radius: 8px;
    border: 1px solid #eee;
    box-shadow: 1px 2px 6px 0 rgba(0, 0, 0, 0.1);
    background-color: ${$WHITE};
    
    & ~ div {
      margin-top: 8px;
    }
    
    ul {
      padding: 6px 16px;
      box-sizing: border-box;
    }

    li {
      width: 100%;
      height: 46px;
      text-align: center;

      &.extra {
        height: 60px;
      }
      
      &::before {
        display: inline-block;
        width: 1px;
        height: 100%;
        margin-left: -1px;
        vertical-align: middle;
        content: '';
      }

      & ~ li {
        border-top: 1px solid ${$BORDER_COLOR};
      }

      img {
        width: 20px;
        vertical-align: middle;
        cursor: pointer;

        &.active {
          animation: 0.5s ${scale} cubic-bezier(0.25, 0.1, 0.25, 1);
        }
      }
      
      a {
        display: inline-block;
        vertical-align: middle;
      }

      span {
        font-size: 11px;
        line-height: 17px;
      }
    }

    button {
      position: relative;
      width: 100%;
      height: 30px;
      padding-left: 14px;
      padding-right: 2px;
      vertical-align: middle;
      text-align: center;
      font-size: 10px;
      cursor: pointer;
      transition: all 300ms;

      & ~ button {
        padding-right: 0;
        border-top: 1px solid #eee;
        img {
          transform: rotate(180deg);
          top: 7px;
        }
      }

      &:hover {
        background-color: #f9f9f9;
      }

      img {
        position: absolute;
        left: 14px;
        top: 5px;
        display: inline-block;
        width: 9px;
        vertical-align: middle;
      }
    }
  }
`;

interface Props {
  id?: HashId;
  isMeetup?: boolean;
  isOnlinePage?: boolean;
  reaction_type?: 'up' | 'down' | '';
  user?: {
    is_writer: boolean
  };
  can_reaction?: boolean;
  is_follow?: boolean;
  can_follow?: boolean;
  can_comment?: boolean;
  can_reply?: boolean;
  blockReaction?: boolean;
  menu_tag?: {
    id: string
  };
  isStoryDetail?: boolean;
}


const FloatingMenu: React.FC<Props> = ({
  id: storyPk,
  can_reaction,
  isMeetup,
  isOnlinePage,
  reaction_type,
  user,
  can_follow,
  is_follow,
  blockReaction,
  can_comment,
  menu_tag = {id: ''},
  isStoryDetail
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const access = useSelector(({system: {session: {access}}}) => access);
  const {id: tagId} = menu_tag;
  const scrollMove = React.useCallback((direction: 'top' | 'bottom' = 'top') => {
    window.scrollTo(0, direction === 'top'
      ? 0
      : 10000
    );
  },[]);

  const {is_writer} = user || {};

  return (
    <WrappperDiv>
      {isStoryDetail && (
        <div>
          <ul>
            {can_reaction && (
              <>
                <li>
                  <img 
                    className={cn({
                      active: reaction_type === 'up'
                    })}
                    src={staticUrl(`/static/images/icon/icon-feed-like${(reaction_type === 'up') ? '-on' : ''}.png`)} 
                    alt="좋아요"
                    onClick={e => {
                      blockReaction && e.stopPropagation();
                      dispatch(toggleStoryReactionThunk(storyPk, 'up'))
                    }}
                  />
                </li>
                {!isMeetup && !isOnlinePage && (
                  <li>
                    <img 
                      className={cn({
                        active: reaction_type === 'down'
                      })}
                      src={staticUrl(`/static/images/icon/icon-feed-unlike${(reaction_type === 'down') ? '-on' : ''}.png`)} 
                      alt="싫어요"
                      onClick={e => {
                        blockReaction && e.stopPropagation();
                        dispatch(toggleStoryReactionThunk(storyPk, 'down'))
                      }}
                    />
                  </li>
                )}
              </>
            )}
            {can_comment && (
              <li>
                <Link
                  href="/community/[id]#[id]"
                  as={`/community/${storyPk}#${storyPk}`}
                >
                  <a>
                    <img
                      src={staticUrl(`/static/images/icon/icon-feed-reply.png`)}
                      alt="댓글"
                    />
                  </a>
                </Link>
              </li>
            )}
            {(can_follow && !is_writer) && (
              <li>
                <img 
                  className={cn({
                    active: is_follow
                  })}
                  src={staticUrl(`/static/images/icon/icon-feed-save${is_follow ? '-on' : ''}.png`)} 
                  alt="저장하기"
                  onClick={e => {
                    if (!!access) {
                      blockReaction && e.stopPropagation();
                      dispatch(toggleFollowStoryThunk(storyPk));
                    } else {
                      confirm('글에 대한 액션은 로그인 후 가능합니다. 로그인 페이지로 이동하시겠습니까?') && router.push('/login');
                    }
                  }}
                />
              </li>
            )}
            <li className="extra">
              <Link
                href={`/community?category=${tagId}`}
              >
                <a>
                  <img 
                    src={staticUrl('/static/images/icon/icon-list-gray20x20.png')}
                  /><br/>
                  <span>목록</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      )}
      <div>
        <button 
          type="button"
          onClick={() => {
            scrollMove('top');
          }}
        >
          <img src={staticUrl('/static/images/icon/triangle-up-gray10x20.png')}/>
          위로
        </button>
        <button 
          type="button"
          onClick={() => {
            scrollMove('bottom');
          }}
        >
          <img 
            src={staticUrl('/static/images/icon/triangle-up-gray10x20.png')}
          />
          아래로
        </button>
      </div>
    </WrappperDiv>
  )
}

FloatingMenu.displayName = 'FloatingMenu';
export default React.memo(FloatingMenu);
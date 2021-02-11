import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import Avatar from '../AvatarDynamic';
import {InfoLi} from '../story/common';
import {timeSince} from '../../src/lib/date';
import {under} from '../../src/lib/numbers';
import Tag from '../UI/tag/Tag';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $GRAY, $BORDER_COLOR, $WHITE, $POINT_BLUE} from '../../styles/variables.types';
import KeyWordHighlight from '../common/KeyWordHighlight';
import {staticUrl} from '../../src/constants/env';

const Li = styled.li`
  position: relative;
  padding: 15px 0 20px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  
  @media screen and (max-width: 680px) {
    padding: 15px 15px 20px;
  }

  .wrapper {
    position: relative;

    .contents {
      &.img-contents {
        padding: 2px 92px 0 0;
        min-height: 69px;
      }

      h2 {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
        })};

        span {
          font-weight: 600;
        }
      }

      .avatar {
        margin: 0;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY
        })};
      }

      p {
        display: block; 
        display: -webkit-box;
        margin: 4px 0 0;
        line-height: 22px;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        ${fontStyleMixin({
          size: 14,
          color: $GRAY
        })};
      }
    }
  }

  .bottom-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    padding-top: 14px;
    box-sizing: border-box;

    .tag {
      width: calc(100% - 110px);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      li {
        display: inline;

        & ~ li p {
          margin-left: 10px;
        }
        
        p {
          display: inline;
          vertical-align: 0;
          padding: 0;
          margin-right: 0;
        }
      }
    }

    .reaction {
      display: table-cell;
      min-width: 100px;
      padding-top: 2px;
      white-space: nowrap;

      li {
        display: inline-block;
        ${fontStyleMixin({
          size: 15,
          weight: '300',
          family: 'Montserrat'
        })};

        & ~ li {
          margin-left: 2px;
        }

        img {
          vertical-align: middle;
          width: 18px;
          height: 18px;
          margin: -5px 2px 0 0;
        }
      }
    }
  }
`;

const ImgDiv = styled.div<{image: string}>`
  position: absolute;
  top: 0;
  right: 0;
  width: 70px;
  height: 69px;
  ${props => backgroundImgMixin({
    img: `${props.image || ''}`,
  })};
  
  div {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 33px;
    ${heightMixin(32)};
    text-align: center;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${$GRAY};
      mix-blend-mode: multiply;
    }

    span {
      position: relative;
      z-index: 1;
      ${fontStyleMixin({
        size: 10,
        weight: '600',
        color: $WHITE,
        family: 'Montserrat'
      })};
    }
  }
`;

const SearchItem = (props) => {
  const {
    title,
    user,
    user_expose_type,
    created_at,
    retrieve_count,
    tags,
    highlightKeyword,
    images,
    summary,
    up_count,
    comment_count,
  } = props;

  const imgLength = images ? images.length : 0;
  
  return (
    <Li>
      <a>
        <div className="wrapper">
          <div className={cn('contents',{'img-contents': !!imgLength})}>
            <h2>
              {highlightKeyword ? (
                <KeyWordHighlight
                  text={title}
                  keyword={highlightKeyword}
                  color={$POINT_BLUE}
                />
              ) : title}
            </h2>
            <p>
              {highlightKeyword ? (
                <KeyWordHighlight
                  text={summary}
                  keyword={highlightKeyword}
                  color={$POINT_BLUE}
                />
              ) : summary}
            </p>
            <ul className="attrs">
              {user && (
                <InfoLi>
                  <Avatar
                    name={user.name || '익명의 유저'}
                    userExposeType={user_expose_type}
                    hideImage
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
          </div>
          {!!imgLength && (
            <ImgDiv image={images[0].image}>
              {imgLength !== 1 && (
                <div>
                  <span>{imgLength > 99 ? '99+' : imgLength}</span>
                </div>
              )}
            </ImgDiv>
          )}
        </div>
        <div className="bottom-wrapper">
          <ul className="reaction">
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-like.png')}
                alt="좋아요"
              />
              {under(up_count)}
            </li>
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-comment.png')}
                alt="댓글"
              />
              {under(comment_count)}
            </li>
          </ul>
          <ul className="tag">
            {tags && tags.map(({id, name, is_follow}) => (
              <li key={id}>
                <Tag
                  name={name}
                  highlighted={is_follow}
                  textHighlighted={highlightKeyword === name}
                  onClick={() => router.push(`/tag/${id}`)}
                />
              </li>
            ))}
          </ul>
        </div>
      </a>
    </Li>
  )
};

SearchItem.displayName = 'SearchItem';
export default React.memo(SearchItem);
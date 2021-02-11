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

  .wrapper {
    position: relative;

    .contents {
      &.img-contents {
        padding: 2px 0 0 125px;
        min-height: 110px;
      }

      h2 {
        padding-bottom: 2px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        ${fontStyleMixin({
          size: 16,
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
        padding: 11px 0 5px;
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
    padding-top: 7px;
    box-sizing: border-box;

    .tag {
      width: calc(100% - 110px);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      li {
        display: inline;
        
        p {
          display: inline;
          vertical-align: 0;
          padding: 0;
        }
      }
    }

    .reaction {
      display: table-cell;
      white-space: nowrap;
      width: 110px;
      padding-top: 2px;
      text-align: right;

      li {
        display: inline-block;
        ${fontStyleMixin({
          size: 15,
          weight: '300',
          family: 'Montserrat'
        })};

        & ~ li {
          margin-left: 10px;
        }

        img {
          vertical-align: middle;
          width: 24px;
          height: 24px;
          margin-top: -5px;
        }
      }
    }
  }
`;

const ImgDiv = styled.div<{image: string}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 110px;
  height: 110px;
  ${props => backgroundImgMixin({
    img: `${props.image || ''}`,
  })};
  
  div {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 31px;
    ${heightMixin(31)};
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
    
      @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
          opacity: 0.6;
          background-color: #000 !important;
      }
    }

    span {
      position: relative;
      z-index: 1;
      ${fontStyleMixin({
        size: 12,
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
          {!!imgLength && (
            <ImgDiv image={images[0].image}>
              {imgLength !== 1 && (
                <div>
                  <span>{imgLength > 99 ? '99+' : imgLength}</span>
                </div>
              )}
            </ImgDiv>
          )}
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
            <p>
              {highlightKeyword ? (
                <KeyWordHighlight
                  text={summary}
                  keyword={highlightKeyword}
                  color={$POINT_BLUE}
                />
              ) : summary}
            </p>
          </div>
        </div>
        <div className="bottom-wrapper">
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
        </div>
      </a>
    </Li>
  )
};

SearchItem.displayName = 'SearchItem';
export default React.memo(SearchItem);
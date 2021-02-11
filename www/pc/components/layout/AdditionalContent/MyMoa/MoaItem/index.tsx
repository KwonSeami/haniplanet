import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import Link from 'next/link';
import {staticUrl} from '../../../../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin} from '../../../../../styles/mixins.styles';
import {$POINT_BLUE, $TEXT_GRAY} from '../../../../../styles/variables.types';

const Li = styled.li`
  position: relative;

  .new-story-count {
    ${fontStyleMixin({
      size: 12,
      weight: '600',
      color: $TEXT_GRAY
    })};

    strong {
      padding-left: 4px;

      &.new {
        color: ${$POINT_BLUE};
      }

      span {
        display: inline-block;
        vertical-align: top;
        padding: 2px 0 0 3px;
        letter-spacing: 0;
        ${fontStyleMixin({
          size: 8, 
          weight: 'bold',
          color: $POINT_BLUE
        })};
      }
    }
  }

  button {
    position: absolute;
    right: 15px;

    img {
      width: 12px;
    }
  }
`;

const AvatarDiv = styled.div<Pick<IMoaItemProps, 'avatar'>>`
  border-radius: 50%;
  ${({avatar}) => backgroundImgMixin({
    img: avatar || staticUrl('/static/images/icon/icon-moa-default.png')
  })}
`;

export interface IMoaItemProps {
  className?: string;
  avatar: string;
  slug: string;
  name: string;
  new_story_count: number;
}

const MoaItem = React.memo<IMoaItemProps>(({className, avatar, slug, name, new_story_count}) => (
  <Li className={className}>
    <Link href={`/band/${slug}`}>
      <a>
        <AvatarDiv
          className="avatar"
          avatar={avatar}
        />
        <div className="moa-box">
          <h2>{name}</h2>
          <p className="new-story-count">
            새글
            <strong className={cn({new: (new_story_count > 0)})}>
              {new_story_count}
              {new_story_count > 0 && (
                <span>NEW</span>
              )}
            </strong>
          </p>
        </div>
        <button className="pointer">
          <img
            src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png')}
            alt="나의MOA 바로가기"
          />
        </button>
      </a>
    </Link>
  </Li>
));

export default MoaItem;

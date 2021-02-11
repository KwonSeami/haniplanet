import React from 'react';
import styled from 'styled-components';
import {TPlanetPick} from '../../../src/reducers/main';
import {backgroundImgMixin, maxLineEllipsisMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import {$WHITE, $TEXT_GRAY} from '../../../styles/variables.types';
import Link from 'next/link';

const Div = styled.div<Pick<Props, 'avatar'>>`
  position: relative;  
  height: 210px;
  margin-bottom: 12px;
  ${({avatar}) => backgroundImgMixin({
    img: staticUrl(avatar || '/static/images/banner/img-pick-best1.png')
  })};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 1%, rgba(0, 0, 0, 0.82));
  }

  .text-box {
    position: absolute;
    z-index: 1;
    left: 0;
    bottom: 19px;
    padding: 0 16px;
    
    p {
      ${maxLineEllipsisMixin(16, 1.44, 2)};
      ${fontStyleMixin({
        weight: 'bold',
        color: $WHITE,
      })};
    }

    span {
      display: inline-block;
      margin-top: 3px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY,
      })};
    }
  }
`;

interface Props extends Omit<TPlanetPick, 'text'> {
}

const MainPick: React.FC<Props> = ({
  avatar,
  story
}) => {
  const {
    id,
    title,
    user,
    extend_to,
  } = story || {};

  const {
    name,
    nick_name
  } = user || {};
  const identifier = name || nick_name || '익명의 유저';

  const storyType = (extend_to === 'community' ? 'community' : 'story');

  return (
    <Div avatar={avatar}>
      <Link
        href="/[storyType]/[id]?referer=pick&device=mobile"
        as={`${storyType}/${id}?referer=pick&device=mobile`}
      >
        <a>
          <div className="text-box">
            <p className="pre-wrap">{title}</p>
            <span>{identifier}</span>
          </div>
        </a>
      </Link>
    </Div>
  );
};

export default React.memo(MainPick);

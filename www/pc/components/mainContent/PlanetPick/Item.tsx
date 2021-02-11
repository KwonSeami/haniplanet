import React from 'react';
import styled from 'styled-components';
import {TPlanetPick} from '../../../src/reducers/main';
import Link from 'next/link';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, maxLineEllipsisMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {$WHITE, $TEXT_GRAY} from '../../../styles/variables.types';
import useElementSize from 'react-element-size';
import cn from 'classnames';

const Li = styled.li<{img: string;}>`
  position: relative;
  display: inline-block;
  height: 230px;
  box-sizing: border-box;
  overflow: hidden;
  ${({img}) => backgroundImgMixin({
    img: staticUrl(img || '/static/images/banner/img-pick-best1.png'),
  })};
  
  &:nth-of-type(1) {
    float: left;
    width: 338px;
    height: 461px;
    margin-right: 1px;
  }

  &:nth-of-type(2) {
    width: 450px;
    margin: 0 1px 1px 0;
  }

  &:nth-of-type(3) {
    width: 300px;
    margin: 0 0 1px;
  }

  &:nth-of-type(4) {
    width: 300px;
    margin-right: 1px;
  }

  &:nth-of-type(5) {
    width: 450px;
  }

  & a::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
    mix-blend-mode: multiply;
    opacity: 0.3;
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
        opacity: 0.6;
        background-color: #000 !important;
    }
  }

  a {
    display: block;
    width: 100%;
    height: 100%;
  }

  .text-box {
    position: absolute;
    z-index: 1;
    bottom: 30px;
    left: 30px;
    width: calc(100% - 60px);
    transform: translateY(35px);
    transition: 0.2s;

    &.long-intro {
      transform: translateY(55px);
    }

    .title-writer-wrapper {
      p {
        ${maxLineEllipsisMixin(18, 1.28, 2)};
        ${fontStyleMixin({
          color: $WHITE,
        })};
      }

      span {
        position: relative;
        margin-top: 4px;
        display: inline-block;
        ${fontStyleMixin({
          size: 12,
          color: $WHITE,
        })};
        opacity: 0.8;
      }
    }
    
    .introduce-pick {
      margin-top: 14px;
      opacity: 0;
      
      p {
        position: relative;
        ${maxLineEllipsisMixin(14, 1.5, 2)};
        color: ${$WHITE};
        opacity: 0.8;
      }
    }
  }
  /* best li over */
  &:hover {
    a::after {
      opacity: 0.6;
    
      @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
        opacity: 0.6;
        background-color: #000 !important;
      }
    }

    .text-box {
      transform: translateY(0);

      .introduce-pick {
        opacity: 1;
      }
    }
  }
`;

const PlanetPickItem: React.FC<TPlanetPick> = ({
  avatar,
  text,
  story
}) => {
  const {
    id,
    title,
    user,
    extend_to
  } = story || {};

  const {
    name,
    nick_name
  } = user || {};
  const identifier = name || nick_name || '익명의 유저';

  const storyType = (extend_to === 'community' ? 'community' : 'story');
  
  const introTextSize = useElementSize();
  const INTRO_HEIGHT = introTextSize.size.height;
  
  return (
    <Li img={avatar}>
      <Link
        href={`/[storyType]/[id]?referer=pick&device=pc`}
        as={`/${storyType}/${id}?referer=pick&device=pc`}
      >
        <a>
          <div
            className={cn('text-box', {'long-intro': INTRO_HEIGHT > 30})}
          >
            <div className="title-writer-wrapper">
              <p className="pre-wrap">{title}</p>
              <span>{identifier}</span>
            </div>
            <div
              className="introduce-pick"
              ref={introTextSize.setRef}
            >
              <p className="pre-wrap">{text}</p>
            </div>
          </div>
        </a>
      </Link>
    </Li>
  );
};

export default React.memo(PlanetPickItem);

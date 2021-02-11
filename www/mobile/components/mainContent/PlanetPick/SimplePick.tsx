import React from 'react';
import styled from 'styled-components';
import {TPlanetPick} from '../../../src/reducers/main';
import {radiusMixin, backgroundImgMixin, maxLineEllipsisMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import Link from 'next/link';

const Div = styled.div<Pick<Props, 'avatar'>>`
  width: 50%;
  margin-bottom: 11px;
  box-sizing: border-box;
  display: inline-block;

  .simple-pick-img {
    display: inline-block;
    width: 54px;
    height: 54px;
    vertical-align: top;
    ${radiusMixin('4px', $BORDER_COLOR)};
    ${({avatar}) => backgroundImgMixin({
      img: staticUrl(avatar || '/static/images/banner/img-pick-best1.png')
    })};
  }

  .text-box {
    display: inline-block;
    width: calc(100% - 54px);
    padding: 3px 0 0 8px;
    vertical-align: top;
    box-sizing: border-box;

    p {
      ${maxLineEllipsisMixin(13, 1.23, 2)};
      ${fontStyleMixin({
        size: 13,
        weight: '600'
      })};
    }

    span {
      max-width: 100%;
      display: inline-block;
      margin-top: 3px;
      ${fontStyleMixin({
        size: 11,
        color: $TEXT_GRAY
      })};
    }
  }
`;

interface Props extends Omit<TPlanetPick, 'text'> {
}

const SimplePick: React.FC<Props> = ({
  avatar,
  story
}) => {
  const {
    id,
    title,
    user
  } = story || {};

  const {
    name,
    nick_name
  } = user || {};
  const identifier = name || nick_name || '익명의 유저';

  return (
    <Div avatar={avatar}>
      <Link
        href="/story/[id]?referer=pick&device=mobile"
        as={`story/${id}?referer=pick&device=mobile`}
      >
        <a>
          <div className="simple-pick-img"/>
          <div className="text-box">
            <p>{title}</p>
            <span className="ellipsis">{identifier}</span>
          </div>
        </a>
      </Link>
    </Div>
  );
};

export default React.memo(SimplePick);

import * as React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {
  $GRAY,
  $THIN_GRAY,
  $FONT_COLOR,
  $TEXT_GRAY
} from '../../../styles/variables.types';
import {fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import Link from 'next/link';
import {staticUrl} from '../../../src/constants/env';

export const AvatarDiv = styled.div<Pick<Props, 'avatar'>>`
  width: 46px;
  height: 46px;
  position: absolute;
  left: 15px;
  top: 50%;
  margin-top: -22px;
  border-radius: 50%;
  ${({avatar}) => backgroundImgMixin({
    img: avatar || staticUrl('/static/images/icon/icon-moa-default.png')
  })};

  @media screen and (max-width: 680px) {
    left: 1px;
  }
`;

export const MoaGatheringDiv = styled.div`
  position: relative;
  padding: 13px 15px 16px 71px;
  width: 100%;
  height: 78px;
  box-sizing: border-box;

  h2 {
    ${fontStyleMixin({
      size: 14,
      weight: '600'
    })};

    img {
      width: 12px;
      display: inline-block;
      vertical-align: middle;
      margin-top: -5px;
    }
  }

  .gather-info li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding-right: 4px;
    margin-right: 8px;
      
    ${fontStyleMixin({
      size: 11,
      color: $TEXT_GRAY
    })}

    span {
      color: ${$FONT_COLOR};
    }

    &::after {
      content: '';
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background-color: ${$THIN_GRAY};
      position: absolute;
      right: -4px;
      top: 50%;
    }

    &:last-child::after {
      display: none;
    }
  }

  p {
    padding-top: 1px;
    ${fontStyleMixin({
      size: 12,
      color: $GRAY
    })}
  }

  &:hover {
    background-color: #f9f9f9;
    mix-blend-mode: multiply;
  }

  @media screen and (max-width: 680px) {
    padding: 13px 15px 16px 57px;
  }
`;

interface Props {
  name: string;
  slug: string;
  created_at: string;
  story_count: number;
  member_count: number;
  body: string;
  avatar?: string;
  bandType: string;
}

const MEMBER_COUNT_NAME = {
  moa: '회원수',
  onclass: '수강생',
};

const MoaGatheringMobile: React.FC<Props> = React.memo(({
  name, slug, created_at, story_count, member_count, body, avatar, bandType
}) => {

  const BandLink = bandType === 'moa' ? 'band' : `${bandType}`;

  return (
    <li>
      <Link 
        href={`/${BandLink}/[slug]`} 
        as={`/${BandLink}/${slug}`}
      >
        <a>
          <MoaGatheringDiv>
            <AvatarDiv avatar={avatar} />
            <h2>
              {name}
              <img
                src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png')}
                alt={`${name} 바로가기`}
              />
            </h2>
            <ul className="gather-info">
              <li>개설일 {moment(created_at).format('YY. MM. DD')}</li>
              <li>총 게시글 <span>{story_count}</span></li>
              <li>
                {MEMBER_COUNT_NAME[bandType]}
                &nbsp;<span>{member_count}</span>
              </li>
            </ul>
            <p className="ellipsis">
              {body}
            </p>
          </MoaGatheringDiv>
        </a>
      </Link>
    </li>
  )
});

export default MoaGatheringMobile;

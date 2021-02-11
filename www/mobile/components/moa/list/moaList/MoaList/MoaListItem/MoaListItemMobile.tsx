import * as React from 'react';
import Link from 'next/link';
import {backgroundImgMixin, fontStyleMixin, maxLineEllipsisMixin} from '../../../../../../styles/mixins.styles';
import styled from 'styled-components';
import {$BORDER_COLOR, $TEXT_GRAY, $THIN_GRAY, $GRAY, $FONT_COLOR} from '../../../../../../styles/variables.types';
import {staticUrl} from '../../../../../../src/constants/env';

export const MoaSliderDiv = styled.div`
  h3 {
    padding-top: 7px;
    font-weight: 600;
    ${maxLineEllipsisMixin(14, 1.3, 2)};
  }

  ul {
    margin-top: -2px;
    
    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      padding: 1px 4px 0 0;
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
        margin-top: -1px;
      }

      &:last-child::after {
        display: none;
      }
    }
  }

  p {
    padding-top: 10px;
    box-sizing: border-box;
    min-height: 43px;
    ${maxLineEllipsisMixin(12, 1.5, 2)};
    color: ${$GRAY};
  }
  
`;

const MoaBanner = styled.div<Pick<Props, 'avatar'>>`
  ${({avatar}) => avatar && backgroundImgMixin({img: avatar || ''})};
  position: relative;
  width: 100%;
  height: 105px;
  padding-top: 27px;
  box-sizing: border-box;
  position: relative;
  border: 1px solid ${$BORDER_COLOR};

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(102, 102, 102, 0.6);
    mix-blend-mode: multiply;
  }
  
  & > img {
    width: 36px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -19px 0 0 -19px;
    
    &.badge {
      position: relative;
      left: auto;
      top: auto;
      z-index: 1;
      display: block;
      width: 52px;
      height: 52px;
      margin: auto;
      border-radius: 50%;
      box-sizing: border-box;
      text-align: center;
    }
  }
`;

interface ICategory {
  avater: string;
  name: string;
}

interface Props {
  avatar: string;
  body: string;
  category: ICategory;
  slug: string;
  name: string;
  member_count: number;
  new_story_count: number;
  story_count: number;
  bandType: 'moa' | 'consultant';
}

const MoaPreviewItemMobile: React.FC<Props> = React.memo(({
  avatar,
  body,
  category,
  slug,
  name,
  member_count,
  new_story_count,
  story_count,
  bandType
}) => {
  const {
    avatar_on: categoryAvatar,
    name: categoryName
  } = category || {} as any;

  const BandLink = ['moa', 'consultant'].includes(bandType) ? 'band' : `${bandType}`;

  return (
    <Link 
      href={`/${BandLink}/[slug]`}
      as={`/${BandLink}/${slug}`}
    >
      <a>
        <MoaSliderDiv>
          <MoaBanner avatar={avatar}>
            {!avatar && (
              <img
                src={staticUrl('/static/images/icon/icon-moa-content-default.png')}
                alt="MOA"
              />
            )}
            {bandType === 'consultant' && (
              <img
                src={categoryAvatar}
                alt={categoryName}
                className="badge"
              />
            )}
          </MoaBanner>
          <h3>{name}</h3>
          <ul>
            <li>
              총 게시글 <span>{story_count}</span>
            </li>
            <li>
              회원수 <span>{member_count}</span>
            </li>
            {new_story_count > 0 && (
              <li>
                새글 <span>{new_story_count}</span>
              </li>
            )}
          </ul>
          <p>{body}</p>
        </MoaSliderDiv>
      </a>
    </Link>
  );
});

export default MoaPreviewItemMobile;

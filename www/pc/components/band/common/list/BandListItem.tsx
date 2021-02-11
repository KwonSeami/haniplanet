import * as React from 'react';
import Link from 'next/link';
import {backgroundImgMixin, fontStyleMixin, maxLineEllipsisMixin} from '../../../../styles/mixins.styles';
import styled from 'styled-components';
import {$BORDER_COLOR, $WHITE, $TEXT_GRAY, $GRAY, $FONT_COLOR} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';
import {useDispatch} from 'react-redux';
import {pushPopup} from '../../../../src/reducers/popup';
import OnComingPopup from '../../../layout/popup/OnComingPopup';

const BandBanner = styled.div<Pick<Props, 'avatar'>>`
  ${({avatar}) => avatar && backgroundImgMixin({img: avatar || ''})};
  width: 210px;
  height: 140px;
  box-sizing: border-box;
  position: relative;
  border: 1px solid ${$BORDER_COLOR};
  
  & > img {
    width: 63px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -30px 0 0 -28px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(102, 102, 102, 0.6);
    mix-blend-mode: multiply;
  }
`;

const BandPreviewH3 = styled.h3`
  width: 100%;
  height: 100%;
  padding: 16px 14px;
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  ${fontStyleMixin({
    size: 15,
    color: $WHITE
  })};
`;

const Shortcuts = styled.span`
  position: absolute;
  display: none;
  z-index: 2;
  right: 16px;
  bottom: 19px;
  box-sizing: border-box;
  ${fontStyleMixin({
    size: 12,
    color: $WHITE,
    weight: 'bold'
  })};

  img {
    width: 58px;
    display: block;
  }
`;

const Badge = styled.span`
  position: absolute;
  z-index: 2;
  bottom: 17px;
  left: 13px;
  display: block;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  box-sizing: border-box;
  text-align: center;
  img {
    width: 100%;
  }
`;

const BannerInfoLi = styled.li`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  padding-top: 9px;
  
  ${fontStyleMixin({
    size: 12,
    color: $TEXT_GRAY
  })};

  span {
    color: ${$FONT_COLOR};
  }
`;

const P = styled.p`
  padding-top: 15px;
  box-sizing: border-box;
  min-height: 76px;
  ${maxLineEllipsisMixin(13, 1.7, 3)};
  color: ${$GRAY};
`;

export const BandSliderDiv = styled.div`
  width: 210px;
  height: 258px;
  padding-bottom: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};

  &:hover {
    ${BandBanner}::after {
      background-color: rgba(102, 102, 102, 0.8);
    }

    ${Shortcuts} {
      display: block;
    }
  }
`;

type IBandType = 'moa' | 'onclass' | 'consultant';

interface ICategory {
  avatar: string;
  name: string;
}

export interface IBandPreviewProps {
  avatar: string;
  body: string;
  category: ICategory;
  slug: string;
  name: string;
  member_count: number;
  new_story_count: number;
  story_count: number;
  bandType: IBandType;
  onclass_status: string;
}

const MEMBER_COUNT_NAME = {
  moa: '회원수',
  consultant: '회원수',
  onclass: '수강생',
};

const BandPreviewItem: React.FC<IBandPreviewProps> = React.memo(({
  avatar,
  body,
  category,
  slug,
  name,
  member_count,
  new_story_count,
  story_count,
  bandType,
  onclass_status,
}) => {
  const {
    avatar_on: categoryAvatar,
    name: categoryName
  } = category || {} as any;

  const dispatch = useDispatch();

  const BandLink = ['moa', 'consultant'].includes(bandType) ? 'band' : `${bandType}`;

  return (
    <BandSliderDiv>
      <Link 
        href={`/${BandLink}/[slug]`}
        as={`/${BandLink}/${slug}`}
      >
        <a>
          <BandBanner avatar={avatar}>
            <BandPreviewH3>{name}</BandPreviewH3>
            {!avatar && (
              <img
                src={staticUrl('/static/images/icon/icon-moa-content-default.png')}
                alt="MOA"
              />
            )}
            <Shortcuts>
              바로가기
              <img
                src={staticUrl('/static/images/icon/arrow/icon-shortcuts-white.png')}
                alt={`${name} 바로가기`}
              />
            </Shortcuts>
            {bandType === 'consultant' && (
              <Badge>
                <img
                  src={categoryAvatar}
                  alt={categoryName}
                />
              </Badge>
            )}
          </BandBanner>
          <ul>
            <BannerInfoLi>
              총 게시글 <span>{story_count}</span>
            </BannerInfoLi>
            <BannerInfoLi>
              &nbsp;·&nbsp;{MEMBER_COUNT_NAME[bandType]} <span>{member_count}</span>
            </BannerInfoLi>
            {new_story_count > 0 && (
              <BannerInfoLi>
                &nbsp;·&nbsp;새글 <span>{new_story_count}</span>
              </BannerInfoLi>
            )}
          </ul>
          <P>{body}</P>
        </a>
      </Link>
    </BandSliderDiv>
  );
});
BandPreviewItem.displayName = 'BandPreviewItem'

export default BandPreviewItem;

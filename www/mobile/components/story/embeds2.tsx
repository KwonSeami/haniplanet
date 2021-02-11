import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $WHITE} from '../../styles/variables.types';
import {
  backgroundImgMixin,
  fontStyleMixin,
  heightMixin,
  inlineBlockMixin,
  maxLineEllipsisMixin,
} from '../../styles/mixins.styles';
import {BASE_URL, staticUrl} from '../../src/constants/env';
import A from '../UI/A';
import KeyWordHighlight from '../common/KeyWordHighlight';
import {movieExtensionParse} from '../../src/lib/atlaskit/renderer';
import WaterMark from "../watermark";

interface Props {
  contentPreview: string | React.ReactNode;
  previewImage: {
    src: string;
    length: number;
  };
  onClick: () => void;
  hasMoreBtn: boolean;
  highlightKeyword?: string;
  thumbnail_url?: string;
  video?: {
    type: 'youtube' | 'vimeo';
    key: string;
  }
}

export const PreviewDiv = styled.div<{
  pb?: string;
  src: Props['previewImage']['length'];
}>`
  position: relative;
  padding-bottom: ${({pb}) => pb || '16px'};
  box-sizing: border-box;
  
  .live-thumbnail {
    width: 100%;
    height: auto;
  }

  ${({length, mh}) => length && `
    padding-left: 162px;
    min-height: ${mh || 164}px;
  `};
  
  .modal-video {
    .modal-video-movie-wrap {
      padding-bottom: 0 !important;
    }
    
    .modal-video-movie-wrap iframe {
      width: 100%;
      height: 380px;
    }
  }
`;

export const PreviewContentP = styled.p`
  ${maxLineEllipsisMixin(14, 1.6, 6)};
  color: ${$GRAY};
`;

export const ImgDiv = styled.div<
  {src: Props['previewImage']['src']}
>`
  position: absolute;
  top: 0;
  left: 2px;
  ${props => backgroundImgMixin({
    img: `${props.src || ''}`,
  })};
  width: 147px;
  height: 147px;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};

  span {
    position: absolute;
    right: 0;
    bottom: 12px;
    z-index: 1;
    display: block;
    width: 38px;
    ${heightMixin(38)};
    ${fontStyleMixin({
      size: 15,
      weight: 'bold',
      color: $WHITE,
      family: 'Montserrat',
    })};
    text-align: center;
    background-color: ${$GRAY};
    background-blend-mode: multiply;
  }

  @media screen and (max-width: 680px) {
    position: static;
    width: 100%;
    height: 210px;
    margin: 13px 0 5px;
  }
`;

const MoreSpan = styled.span`
  display: block;
  padding-top: 5px;
  cursor: pointer;
  ${fontStyleMixin({
    size: 12,
    weight: 'bold',
    color: $GRAY,
  })};

  img {
    ${inlineBlockMixin(20)};
    margin: -1px 4px 0 0;
  }
`;

interface IUrlCardProps {
  url: string;
  title: string;
  description: string;
  image: string;
}

export const UrlCard = React.memo<IUrlCardProps>((
  {
    url_card: {
      url,
      title,
      description,
      image,
    },
    highlightKeyword,
  },
) => (
  <A
    to={url}
    data-url={url}
    style={{display: 'block', border: 'solid 1px #dddddd', padding:'8px', backgroundColor: '#f8f8f8'}}
    newTab
  >
    <PreviewDiv
      length={1}
      className="clearfix preview"
      pb="0px"
      mh={150}
    >
      <h4 style={{fontSize: '14px', fontWeight: 600, paddingBottom:'3px', color: $GRAY}}>
        {highlightKeyword ? (
          <KeyWordHighlight
            text={title}
            keyword={highlightKeyword}
            color={$POINT_BLUE}
          />
        ) : title}
      </h4>
      <PreviewContentP>
        {highlightKeyword ? (
          <KeyWordHighlight
            text={description}
            keyword={highlightKeyword}
            color={$POINT_BLUE}
          />
        ) : description}
      </PreviewContentP>
      <ImgDiv src={image}/>
    </PreviewDiv>
  </A>
));

export const StoryPreview = React.memo<Props>(({
  waterMarkProps,
  contentPreview,
  previewImage: {src, length} = {} as any,
  onClick,
  hasMoreBtn,
  highlightKeyword,
  thumbnail_url,
  video,
}) => (
  <PreviewDiv
    length={length}
    className="clearfix preview"
  >
    <PreviewContentP className="pre-line">
      {highlightKeyword ? (
        <KeyWordHighlight
          text={contentPreview as string}
          keyword={highlightKeyword}
          color={$POINT_BLUE}
        />
      ) : contentPreview}
    </PreviewContentP>
    {thumbnail_url && (
      <div className="live-thumbnail">
        <img src={thumbnail_url} alt="라이브 썸네일 이미지"/>
      </div>
    )}
    {!!video && (
      <WaterMark {...waterMarkProps}>
        {movieExtensionParse(video)}
      </WaterMark>
    )}
    {hasMoreBtn && (
      <MoreSpan
        className="more"
        onClick={onClick}
      >
        <img
          src={staticUrl('/static/images/icon/icon-more-btn2.png')}
          alt="더보기"
        />
        더보기
      </MoreSpan>
    )}
    {!!length && (
      <ImgDiv src={src}>
        {length !== 1 && (
          <span>{length > 99 ? '99+' : length}</span>
        )}
      </ImgDiv>
    )}
  </PreviewDiv>
));

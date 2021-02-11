import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import {
  backgroundImgMixin,
  fontStyleMixin,
  heightMixin,
  inlineBlockMixin,
  maxLineEllipsisMixin,
} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
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
  thumbnail_url?: string;
  highlightKeyword?: string;
  video?: {
    type: 'youtube' | 'vimeo';
    key: string;
  }
}

export const UrlCardFrame = styled.div`
  margin: 4px 20px 14px;
  padding: 10px 12px;
  border: solid 1px ${$BORDER_COLOR};
  background-color: #fbfbfb;
  
  & > button {
    width: 20px;
    height: 20px;
    float: right;
    position: relative;
    cursor: pointer;
    z-index: 1;
    
    & > img {
      width: inherit;
      height: inherit;
    }
  }
  
  button + a > div {
    max-width: calc(100% - 20px);
  }
  
  .preview {
    min-height: 84px;
    padding: 0;
    
    .thumbnail {
      width: 84px;
      height: 84px;
      
      & + .content {
        padding-left: 96px;
      }
    }  
    
    .content {
      h4 {
        padding-bottom: 3px;
        ${
          fontStyleMixin({
            size: 14,
            weight: '600',
            color: $GRAY
          })
        };
        
        & + p {
          height: 40px; 
          -webkit-line-clamp: 2;
        }
      }
      
      p {
        height: 60px;
        margin-bottom: 5px;
        font-size: 12px;
        line-height: 19px;
        -webkit-line-clamp: 3;
      }
      
      span {
        display: block;
        max-width: 100%;
        ${
          fontStyleMixin({
            size: 12,
            color: $TEXT_GRAY
          })
        };
        text-decoration: underline;
      }
    }
  }
`;

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
      height: 400px;
    }
  }
`;

export const PreviewContentP = styled.p`
  ${maxLineEllipsisMixin(14, 1.6, 6)}
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
    bottom: 0;
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

    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      /* TODO: 현재 IE가 확인되지않아 스타일 추가 불가능합니다.
        content: '';
        background: transparentize(darken(#2d4a83, 7), .8);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;*/
    }
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

interface IUrlCardProps extends Pick<Props, 'highlightKeyword'> {
  deleteUrlCard?: () => void;
  url_card: {
    description: string;
    id: string;
    image: string;
    title: string;
    url: string;
  }
}

export const UrlCard = React.memo<IUrlCardProps>((
  {
    deleteUrlCard,
    highlightKeyword,
    url_card: {
      url,
      title,
      description,
      image,
    }
  },
) => {
  const deleteUrlCardButton = React.useMemo(() => deleteUrlCard && (
    <button onClick={() => !!url && deleteUrlCard()}>
      <img
        alt="URL 카드 삭제"
        src={"/static/images/icon/icon-close.png"}
      />
    </button>
  ), [url, deleteUrlCard]);

  const isTitleExist = !!title;
  const isImageExist = (image || '').split('og/og_images/')[1];

  return (
    <UrlCardFrame className="embed-urlcard">
      {deleteUrlCard && deleteUrlCardButton}
      <A
        to={url}
        data-url={url}
        newTab
      >
        <PreviewDiv
          length={1}
          className="clearfix preview"
          pb="0px"
          mh={150}
        >
          {isImageExist && <ImgDiv className="thumbnail" src={image}/>}
          <div className="content">
            {isTitleExist && (
              <h4 className="ellipsis">
                {highlightKeyword ? (
                  <KeyWordHighlight
                    text={title}
                    keyword={highlightKeyword}
                    color={$POINT_BLUE}
                  />
                ) : title}
              </h4>
            )}
            <PreviewContentP>
              {highlightKeyword ? (
                <KeyWordHighlight
                  text={description}
                  keyword={highlightKeyword}
                  color={$POINT_BLUE}
                />
              ) : description}
            </PreviewContentP>
            <span className="ellipsis">{url}</span>
          </div>
        </PreviewDiv>
      </A>
    </UrlCardFrame>
  )
});

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

StoryPreview.displayName = 'StoryPreview';

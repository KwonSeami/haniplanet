import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import {
  fontStyleMixin,
  maxLineEllipsisMixin,
  heightMixin,
  backgroundImgMixin,
} from '../../styles/mixins.styles';
import A from '../UI/A';
import KeyWordHighlight from '../common/KeyWordHighlight';
import StoryThumbnailImg from './StoryThumbnailImg';

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
  
  @media screen and (max-width: 680px) {  
    margin: 4px 15px 14px;
    
    .preview {      
      padding-bottom: 0 !important;
      
      .thumbnail {
        position: absolute;
        top: 0;
        margin-top: 0;
      }
    }
  }
`;

interface Props {
  contentPreview: string | React.ReactNode;
  previewImage?: {
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
  images: string;
}

export const PreviewDiv = styled.div<{
  pb?: string;
  length?: Props['previewImage']['length'];
  mh?: number;
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

  &.preview .more {
    display: block;
    padding-bottom: 4px;
    line-height: 20px;
    ${fontStyleMixin({
      size: 14,
      color: $TEXT_GRAY
    })};
  }
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

export const PreviewContentP = styled.p`
  ${maxLineEllipsisMixin(14, 1.45, 4)};
  color: ${$GRAY};
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
  contentPreview,
  onClick,
  highlightKeyword,
  thumbnail_url,
  video,
  images,
}) => {

  const imgLength = images ? images.length : 0;

  return (
    <PreviewDiv className="clearfix preview">
      <PreviewContentP
        className="pre-line"
        onClick={onClick}
      >
        {highlightKeyword ? (
          <KeyWordHighlight
            text={contentPreview as string}
            keyword={highlightKeyword}
            color={$POINT_BLUE}
          />
        ) : contentPreview}
      </PreviewContentP>
      <span
        className="more"
        onClick={onClick}
      >더보기</span>
      {thumbnail_url && (
        <div className="live-thumbnail">
          <img src={thumbnail_url} alt="라이브 썸네일 이미지"/>
        </div>
      )}
      {(!!imgLength || video) && (
        <StoryThumbnailImg
          contentImg
          video={video}
          images={images}
          childrenSize={31}
          fontSize={14}
          playImgSize={60}
          onClick={onClick}
        />
      )}
    </PreviewDiv>
  );
});

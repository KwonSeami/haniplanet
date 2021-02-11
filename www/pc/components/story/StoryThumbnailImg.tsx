import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from "styled-components";
import {backgroundImgMixin, fontStyleMixin, heightMixin} from "../../styles/mixins.styles";
import {$GRAY, $WHITE} from "../../styles/variables.types";
import {staticUrl} from "../../src/constants/env";
import { axiosInstance } from '@hanii/planet-apis';

interface ImgToVideoDivProps {
  image: string;
  size: {
    width: number;
    height: number;
  }
  childrenSize: number;
  fontSize: number;
  playImgSize: number;
  position: {
    top: number;
    side: string;
  }
}

const ImgToVideoDiv = styled.div<ImgToVideoDivProps>`
  position: absolute;
  ${({position}) => `
    top: ${position.top}px;
    ${position.side}: 0px;
  `};
  ${({size}) => `
    width: ${size.width}px;
    height: ${size.height}px;
  `};
  border: 1px solid #eee;
  ${({image}) => backgroundImgMixin({
    img: `${image || ''}`,
  })};
  box-sizing: border-box;
  
  div {
    position: absolute;
    right: 0;
    bottom: 0;
    width: ${({childrenSize}) => childrenSize}px;
    ${({childrenSize}) => heightMixin(childrenSize)};
    text-align: center;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${$GRAY};
      mix-blend-mode: multiply;
    
      @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
        opacity: 0.6;
        background-color: #000 !important;
      }
    }

    span {
      position: relative;
      z-index: 1;
      ${({fontSize}) => fontStyleMixin({
        size: fontSize,
        weight: '600',
        color: $WHITE,
        family: 'Montserrat'
      })};
    }
  }

  > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${({playImgSize}) => playImgSize}px;
  }
`;

interface Props extends Partial<ImgToVideoDivProps> {
  video?: {
    type: 'vimeo' | 'youtube';
    key: string;
  };
  images?: any;
}

const StoryThumbnailImg: React.FC<Props> = ({
  video = {},
  images = [],
  ...rest
}) => {
  const imgCount = images.length;
  const {type: videoType, key: videoKey} = video || {};
  const [image, setImgae] = React.useState('');

  React.useEffect(() => {
    switch (videoType) {
      case "vimeo":
        !image && axiosInstance({baseURL: 'https://vimeo.com/api/v2'})
          .get(`/video/${videoKey}.json`)
          .then(({data}) => setImgae(data[0].thumbnail_medium));
        break;
      case "youtube":
        setImgae(`http://i3.ytimg.com/vi/${videoKey}/hqdefault.jpg`);
        break;
      default:
        !isEmpty(images) && setImgae(images[0].image);
    }
  }, [videoType, image, videoKey, images]);

  return (
    <ImgToVideoDiv
      className="story-thumbnail-img"
      image={image}
      {...rest}
    >
      {(imgCount > 1 && isEmpty(video)) && (
        <div>
          <span>{imgCount > 99 ? '99+' : imgCount}</span>
        </div>
      )}
      {!isEmpty(video) && (
        <img
          src={staticUrl('/static/images/icon/icon-play.png')}
          alt="동영상"
        />
      )}
    </ImgToVideoDiv>
  );
};

export default React.memo(StoryThumbnailImg);

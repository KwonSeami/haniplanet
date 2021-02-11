import React from 'react';
import styled from 'styled-components';
import A from '../../UI/A';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin, maxLineEllipsisMixin} from '../../../styles/mixins.styles';
import {$GRAY, $TEXT_GRAY} from '../../../styles/variables.types';

const Div = styled.div`
  position: relative;
  width: 196px !important;
  height: 271px !important;
  margin-right: 27px;

  a:hover {
    .content-top-wrapper div {
      transform: scale(1.2);
    }

    h2 {
      text-decoration: underline;
    }
  }

  .content-top-wrapper {
    width: 100%;
    height: 130px;
    margin-bottom: 14px;
    border-radius: 4px;
    border: 1px solid #eee;
    box-sizing: border-box;
    overflow: hidden;
  }

  h2 {
    line-height: 20px;
    ${maxLineEllipsisMixin(15, 1.4, 2)};
    ${fontStyleMixin({
      weight: '600',
    })};
  }

  .newspaper {
    margin: 4px 0 5px;

    span {
      ${fontStyleMixin({
        size: 13,
        weight: '600',
        color: $TEXT_GRAY
      })};
    }
  }

  .introduction {
    ${maxLineEllipsisMixin(13, 1.5, 3)};
    ${fontStyleMixin({
      size: 13,
      color: $GRAY
    })};
  }
`;

const ImgWrapper = styled.div<{image: string;}>`
  position: relative;
  width: 100%;
  height: 100%;
  ${({image}) => backgroundImgMixin({
    img: staticUrl(image || '/static/images/banner/daily-news-null.png')
  })};
  transition: transform 0.3s;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.1));
  }
`;

interface Props {
  url: string;
  title: string;
  description: string;
  image: string;
  newspaper: string;
}

const DailyNews: React.FC<Props> = ({
  url,
  title,
  description,
  image,
  newspaper
}) => (
  <Div>
    <A
      to={url}
      newTab
    >
      <div className="content-top-wrapper">
        <ImgWrapper image={image}/>
      </div>
      <h2>{title}</h2>
    </A>
    <div className="newspaper">
      <span>{newspaper}</span>
    </div>
    <p className="introduction">
      {description}
    </p>
  </Div> 
);

export default React.memo(DailyNews);

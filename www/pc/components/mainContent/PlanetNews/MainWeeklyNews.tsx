import React from 'react';
import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin, lineEllipsisMixin, radiusMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import {$TEXT_GRAY, $GRAY} from '../../../styles/variables.types';
import A from '../../UI/A';

const MainWeeklyNewsDiv = styled.div`
  height: 90px;
  margin-bottom: 16px;

  a:hover {
    h3 {
      text-decoration: underline;
    }

    .weekly-news-img {
      transform: scale(1.2);
    }
  }

  a {
    display: table;
    table-layout: fixed;
    width: 100%;

    > div {
      display: table-cell;
      vertical-align: top;
  
      &:nth-of-type(2) {
        padding-left: 16px;
      }
    }
  }

  h3 {
    margin: 3px 0 2px;
    ${fontStyleMixin({
      size: 16,
      weight: '600'
    })};
  }

  span {
    ${fontStyleMixin({
      size: 12,
      weight: '600',
      color: $TEXT_GRAY
    })};
  }

  p {
    ${lineEllipsisMixin(13, 20, 2)};
    color: ${$GRAY};
  }
`;

const ImgWrapper = styled.div<{image: string;}>`
  position: relative;
  width: 130px;
  height: 90px;
  ${radiusMixin('4px', '#eee')};
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.5));
  }

  .weekly-news-img {
    width: 100%;
    height: 100%;
    transition: transform 0.3s;
    ${({image}) => backgroundImgMixin({
      img: staticUrl(image)
    })};
  }
`;

interface Props {
  url: string;
  title: string;
  description: string;
  image: string;
  newspaper: string;
}

const MainWeeklyNews: React.FC<Props> = ({
  url,
  title,
  description,
  image,
  newspaper
}) => (
  <MainWeeklyNewsDiv>
    <A
      to={url}
      newTab
    >
      {image && (
        <ImgWrapper image={image}>
          <div className="weekly-news-img"/>
        </ImgWrapper>
      )}
      <div>
        <h3 className="ellipsis">{title}</h3>
        <span>{newspaper}</span>
        <p>{description}</p>
      </div>
    </A>
  </MainWeeklyNewsDiv>
);

export default React.memo(MainWeeklyNews);

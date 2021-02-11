import React from 'react';
import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin, lineEllipsisMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import {$TEXT_GRAY, $GRAY} from '../../../styles/variables.types';
import A from '../../UI/A';

const MainNewsDiv = styled.div`
  height: 100px;
  margin-bottom: 12px;

  a {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  div {
    display: table-cell;
    vertical-align: top;

    &:nth-of-type(2) {
      padding-left: 12px;
    }

    &.right-content {
      h3 {
        max-width: 100%;
        margin-bottom: 3px;
        ${fontStyleMixin({
          size: 15,
          weight: '600'
        })};
      }
    
      span {
        display: inline-block;
        margin-bottom: 3px;
        ${fontStyleMixin({
          size: 12,
          weight: '600',
          color: $TEXT_GRAY
        })};
      }
    
      p {
        ${lineEllipsisMixin(13, 19, 3)};
        color: ${$GRAY};
      }
    }
  }
`;

const NewsImg = styled.div<Pick<Props, 'image'>>`
  width: 102px;
  height: 100%;
  border-radius: 4px;
  border: 1px solid #eee;
  box-sizing: border-box;
  ${({image}) => backgroundImgMixin({
    img: staticUrl(image)
  })};
`;

interface Props {
  url: string;
  title: string;
  description: string;
  image: string;
  newspaper: string;
}

const MainDailyNews: React.FC<Props> = ({
  url,
  title,
  description,
  image,
  newspaper
}) => (
  <MainNewsDiv>
    <A
      to={url}
      newTab
    >
      {image && (
        <NewsImg image={image}/>
      )}
      <div className="right-content">
        <h3 className="ellipsis">{title}</h3>
        <span>{newspaper}</span>
        <p>{description}</p>
      </div>
    </A>
  </MainNewsDiv>
);

export default React.memo(MainDailyNews);

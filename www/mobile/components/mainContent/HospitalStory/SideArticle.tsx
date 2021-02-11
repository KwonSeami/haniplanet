import React from 'react';
import styled from 'styled-components';
import {$GRAY, $TEXT_GRAY} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin, lineEllipsisMixin} from '../../../styles/mixins.styles';
import Avatar from '../../Avatar';
import A from '../../UI/A';

const Div = styled.div`
  position: relative;
  padding: 15px 0 0;

  .content-right {
    display: inline-block;
    width: calc(100% - 54px);
    padding-left: 12px;
    box-sizing: border-box;
    vertical-align: top;

    > div {
      display: inline-flex;
      width: 100%;

      h2 {
        margin-bottom: 2px;
        vertical-align: top;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
        })};
      }
      
      .avatar {
        margin-left: 2px;
        vertical-align: top;
        white-space: nowrap;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY
        })};
      }
    }

    .introduction {
      ${lineEllipsisMixin(12, 19, 2)};
      color: ${$GRAY};
    }
  }
`;

const ImgWrapper = styled.div<{img: string;}>`
  position: relative;
  display: inline-block;
  width: 54px;
  height: 54px;
  border-radius: 4px;
  border: 1px solid #eee;
  box-sizing: border-box;
  vertical-align: top;
  ${({img}) => backgroundImgMixin({
    img: staticUrl(img)
  })};

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
  title: string;
  user: any;
  description: string;
  image: string;
  url: string;
}

const SideArticle: React.FC<Props> = ({
  title,
  user,
  description,
  image,
  url
}) => {
  const {
    id,
    name,
    nick_name
  } = user;

  const identifier = name || nick_name;

  return (
    <Div>
      <A
        to={url}
        newTab
      >
        <ImgWrapper img={image}/>
        <div className="content-right">
          <div>
            <h2 className="ellipsis">{title}</h2>
            <Avatar
              id={id}
              name={identifier}
              hideImage
            />
          </div>
          <p className="introduction">
            {description}
          </p>
        </div>
      </A>
    </Div>
  );
};

export default React.memo(SideArticle);

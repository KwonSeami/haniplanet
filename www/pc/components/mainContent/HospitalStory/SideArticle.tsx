import React from 'react';
import styled from 'styled-components';
import {$GRAY, $POINT_BLUE, $TEXT_GRAY, $BORDER_COLOR} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin, maxLineEllipsisMixin} from '../../../styles/mixins.styles';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import A from '../../UI/A';
import Avatar from '../../Avatar';
import Link from 'next/link';

const Div = styled.div`
  position: relative;
  width: 196px !important;
  height: 271px !important;
  margin-right: 25px;
  transform: translateY(36px);

  a {
    &:hover {
      .img-wrapper {
        transform: scale(1.08);
      }

      h2 {
        text-decoration: underline;
      }
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

  .writer {
    margin: 4px 0 5px;

    .avatar {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 13,
        weight: '600',
      })};
    }

    p {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 13,
        weight: '600',
        color: $TEXT_GRAY
      })};
    }

    span {
      position: relative;
      display: inline-block;
      padding-left: 5px;
      margin-left: 6px;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        color: $POINT_BLUE
      })};

      &::after {
        content: '';
        position: absolute;
        top: 7px;
        left: 0;
        width: 1px;
        height: 6px;
        background-color: ${$BORDER_COLOR};
      }

      &:hover {
        text-decoration: underline;
      }

      img {
        display: inline-block;
        width: 12px;
        margin-bottom: -2px;
      }
    }
  }
  
  .introduction {
    ${maxLineEllipsisMixin(13, 1.46, 3)};
    ${fontStyleMixin({
      size: 13,
      color: $GRAY
    })};
  }
`;

const ImgWrapper = styled.div<{img: string;}>`
  position: relative;
  width: 100%;
  height: 100%;
  ${({img}) => backgroundImgMixin({
    img: staticUrl(img)
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
  title: string;
  user: any;
  description: string;
  image: string;
  url: string;
}

const SideArticle: React.FC<Props> = (({
  title,
  user,
  description,
  image,
  url
}) => {
  const {
    id,
    name,
    nick_name,
    hospital_name,
    hospital_slug,
    user_type
  } = user;

  const identifier = name || nick_name;

  return (
    <Div>
      <A
        to={url}
        newTab
      >
        <div className="content-top-wrapper">
          <ImgWrapper
            className="img-wrapper"
            img={image}
          />
        </div>
        <h2>{title}</h2>
      </A>
      <div className="writer">
        <Avatar
          id={id}
          name={identifier}
          hideImage
        />
        <p>&nbsp;{USER_TYPE_TO_KOR[user_type]}</p>
        {(hospital_name && hospital_slug) && (
          <Link
            href="/band/[slug]"
            as={`/band/${hospital_slug}`}
          >
            <a>
              <span>
                {hospital_name}
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-gray-shortcuts.png')}
                  alt="화살표"
                />
              </span>
            </a>
          </Link>
        )}
      </div>
      <p className="introduction">
        {description}
      </p>
    </Div>
  );
});



export default React.memo(SideArticle);

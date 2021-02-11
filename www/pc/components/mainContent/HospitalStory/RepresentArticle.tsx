import React from 'react';
import styled from 'styled-components';
import {$WHITE, $GRAY, $POINT_BLUE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import Button from '../../inputs/Button';
import {fontStyleMixin, backgroundImgMixin, maxLineEllipsisMixin} from '../../../styles/mixins.styles';
import {useRouter} from 'next/router';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import A from '../../UI/A';
import Avatar from '../../Avatar';
import isEmpty from 'lodash/isEmpty';

const Div = styled.div`
  position: relative;
  width: 420px !important;
  min-height: 352px;
  margin-right: 28px;

  .content-top-wrapper {
    position: relative;
    width: 100%;
    height: 260px;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid #eee;
    box-sizing: border-box;

    &:hover {
      .img-wrapper {
        transform: scale(1.08);
      }
    }

    > div {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    h2 {
      position: absolute;
      left: 0;
      bottom: 26px;
      max-height: 50px;
      line-height: 25px;
      padding: 0 20px 24px;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      letter-spacing: normal;
      ${fontStyleMixin({
        size: 20,
        weight: '300',
        color: $WHITE
      })};
    }
  }

  .writer {
    position: absolute;
    left: 22px;
    top: 210px;

    .avatar {
      display: inline-block;
      vertical-align: middle;
      line-height: 26px;
      ${fontStyleMixin({
        size: 13,
        color: $WHITE,
        weight: 'normal',
      })};

      .cropped-image {
        margin-right: 4px;
      }
    }

    p {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 13,
        color: $WHITE,
        weight: 'normal'
      })};
    }

    .button {
      padding: 1px 6px 2px 9px;
      vertical-align: middle;

      &:hover {
        border-color: ${$POINT_BLUE};
        background-color: ${$POINT_BLUE};
      }

      img {
        display: inline-block;
        width: 12px;
        margin-bottom: -2px;
      }
    }
  }
  
  .introduction {
    padding-top: 20px;
    ${maxLineEllipsisMixin(14, 1.71, 3)};
    ${fontStyleMixin({
      size: 14,
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
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.5));
  }
`;

interface Props {
  title: string;
  user: any;
  description: string;
  image: string;
  url: string;
}

const RepresentArticle: React.FC<Props> = (({
  title,
  user,
  description,
  image,
  url
}) => {
  const router = useRouter();

  const {
    id,
    name,
    avatar,
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
          <div>
            <ImgWrapper
              className="img-wrapper"
              img={image}
            />
          </div>
          <h2>{title}</h2>
        </div>
      </A>
      {!isEmpty(user) && (
        <div className="writer">
          <Avatar
            id={id}
            name={identifier}
            src={avatar}
            size={23}
          />
          <p>
            &nbsp;{USER_TYPE_TO_KOR[user_type]}
          </p>
          {(hospital_name && hospital_slug) && (
            <Button
              border={{
                width: '1px',
                color: $WHITE,
                radius: '12px'
              }}
              font={{
                size: '12px',
                color: $WHITE
              }}
              backgroundColor="rgba(255, 255, 255, 0.1)"
              onClick={() => router.push('/band/[slug]', `/band/${hospital_slug}`)}
            >
              {hospital_name}
              <img
                src={staticUrl('/static/images/icon/arrow/icon-white-arrow.png')}
                alt="이동하기"
              />
            </Button>
          )}
        </div>
      )}
      <p className="introduction">
        {description}
      </p>
    </Div>
  );
});

export default React.memo(RepresentArticle);

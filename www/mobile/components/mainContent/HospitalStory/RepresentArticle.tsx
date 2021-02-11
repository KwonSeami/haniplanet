import React from 'react';
import styled from 'styled-components';
import {$GRAY, $POINT_BLUE, $TEXT_GRAY, $BORDER_COLOR} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin, lineEllipsisMixin} from '../../../styles/mixins.styles';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {useRouter} from 'next/router';
import Avatar from '../../Avatar';
import A from '../../UI/A';

const Div = styled.div`
  position: relative;
  padding: 15px 0 19px;
  border-bottom: 1px solid #eee;

  .content-right {
    display: inline-block;
    width: calc(100% - 102px);
    padding-left: 12px;
    box-sizing: border-box;
    vertical-align: top;

    h2 {
      margin-bottom: 2px;
      ${fontStyleMixin({
        size: 15,
        weight: '600',
      })};
    }

    > div {
      display: inline-flex;
      width: 100%;
      margin-bottom: 2px;

      p {
        display: inline-block;

        .avatar {
          margin: 0;
          display: inline-block;
          ${fontStyleMixin({
            size: 12,
          })};
        }
  
        span {
          vertical-align: text-top;
          ${fontStyleMixin({
            size: 12,
            color: $TEXT_GRAY
          })};
  
          &.hospital-name {
            position: relative;
            padding-left: 6px;
            margin-left: 5px;
            ${fontStyleMixin({
              size: 12,
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
          }
        }
      }

      > img {
        display: inline-block;
        width: 12px;
        height: 13px;
        margin-top: 3px;
      }
    }
  
    p.introduction {
      margin-top: 2px;
      ${lineEllipsisMixin(13, 19, 3)};
      color: ${$GRAY};
    }
  }
`;

const ImgWrapper = styled.div<{img: string;}>`
  position: relative;
  display: inline-block;
  width: 102px;
  height: 100px;
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

const RepresentArticle: React.FC<Props> = ({
  title,
  user,
  description,
  image,
  url
}) => {
  const router = useRouter();

  const {
    hospital_name,
    hospital_slug,
    user_type,
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
          <h2 className="ellipsis">{title}</h2>
          <div>
            <p className="ellipsis">
              <Avatar
                id={id}
                name={identifier}
                hideImage
              />
              <span>&nbsp;{USER_TYPE_TO_KOR[user_type]}</span>
              {(hospital_name && hospital_slug) && (
                <span
                  className="pointer hospital-name"
                  onClick={() => router.push('/band/[slug]', `/band/${hospital_slug}`)}
                >
                  {hospital_name}
                </span>
              )}
            </p>
            {(hospital_name && hospital_slug) && (
              <img
                src={staticUrl('/static/images/icon/arrow/icon-gray-shortcut.png')}
                alt="이동하기"
              />
            )}
          </div>
          <p className="introduction">
            {description}
          </p>
        </div>
      </A>
    </Div>
  );
};

export default React.memo(RepresentArticle);

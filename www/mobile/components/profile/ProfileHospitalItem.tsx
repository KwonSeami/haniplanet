import styled from "styled-components";
import {backgroundImgMixin, fontStyleMixin, maxLineEllipsisMixin} from "../../styles/mixins.styles";
import * as React from "react";
import Link from "next/link";
import {staticUrl} from "../../src/constants/env";
import {$WHITE, $GRAY} from "../../styles/variables.types";

const WorkingHospitalItemLink = styled.a`
  display: block;
  position: relative;
  width: 100%;
  min-height: 180px;
  padding: 43px 0 0 0;
  box-sizing: border-box;
  padding-bottom: 10px;

  .hospital-name {
    width: 100%;
    height: 180px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;

    &::after {
      content: '';
      width: 100%;
      height: 180px;
      position: absolute;
      top: 0;
      left: 0;
      mix-blend-mode: multiply;
      background-color: ${$GRAY};
      opacity: 0.8;

      @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
        background-color: #000;
        opacity: 0.5;
      }
    }

    .hospital-title {
      position: absolute;
      z-index: 1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      h3 {
        ${fontStyleMixin({
          size: 19,
          color: $WHITE
        })}
      }

      span {
        margin-top: 1px;
        display: inline-block;
        width: 53px;
        height: 16px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8.5px;
        text-align: center;
        padding: 0;
        line-height: 14px;

        strong {
          ${fontStyleMixin({
            size: 11,
            weight: '600',
            color: $WHITE
          })}
        }
      }
    }

    .hospital-shortcuts {
      position: absolute;
      z-index: 1;
      bottom: 12px;
      right: 15.7px;
      width: 57.3px;
      text-align: left;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        color: $WHITE
      })}

      img {
        display: inline-block;
        vertical-align: middle;
        width: 57.3px;
        margin: -17px 0 0 0;
      }
    }
  }

  p {
    ${maxLineEllipsisMixin(14, 1.3, 2)}
    color: #999;
  }

  span {
    display: block;
    padding-top: 5px;
    ${fontStyleMixin({
      size: 13,
      color: '#999'
    })}

    img {
      width: 16px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 2px 0 0;
    }
  }
`;

const AvatarDiv = styled.div<{ img?: string; }>`
  margin-top: -42px;
  width: 100%;
  height: 180px;
  ${({img}) => backgroundImgMixin({
    img: img || ''
  })};
`;

interface Props {
  slug: string;
  avatar: string;
  name: string;
  extension: {
    address: string;
    detail_address: string;
    telephone: string;
  };
  position?: string;
}

const ProfileHospitalItem: React.FC<Props> = React.memo(
  (
    {
      slug,
      avatar,
      name,
      extension: {
        address,
        detail_address,
        telephone
      },
      position
    }
  ) => (
    <Link
      href="/band/[slug]"
      as={`/band/${slug}`}
      passHref
    >
      <WorkingHospitalItemLink>
        <AvatarDiv img={avatar}/>
        <div className="hospital-name">
          <div className="hospital-title">
            <h3>
              {name}
            </h3>
            {position && (
              <span>
                <strong>{position}</strong>
              </span>
            )}
          </div>
          <span className="hospital-shortcuts">
            바로가기
            <img
              src={staticUrl("/static/images/icon/arrow/icon-shortcuts-white.png")}
              alt="바로가기"
            />
          </span>
        </div>
        <span>
          <img
            src={staticUrl('/static/images/icon/icon-location.png')}
            alt="위치"
          />
          {address}{detail_address && `, ${detail_address}`}
        </span>
        <span>
          <img
            src={staticUrl("/static/images/icon/icon-telephone.png")}
            alt="전화번호"
          />
            {telephone}
        </span>
      </WorkingHospitalItemLink>
    </Link>
  ));

ProfileHospitalItem.displayName = 'ProfileHospitalItem';

export default ProfileHospitalItem;

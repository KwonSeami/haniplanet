import * as React from "react";
import styled from "styled-components";
import {backgroundImgMixin, fontStyleMixin, maxLineEllipsisMixin} from "../../styles/mixins.styles";
import Link from "next/link";
import {staticUrl} from "../../src/constants/env";
import {$BORDER_COLOR} from "../../styles/variables.types";

export const HospitalItemLink = styled.a`
  display: block;
  position: relative;
  width: 100%;
  min-height: 118px;
  padding: 14px 15px 15px 120px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};

  @media screen and (max-width: 680px) {
    padding: 14px 15px 15px 135px;
  }

  h3 {
    padding-bottom: 4px;

    span {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 17,
        weight: '600'
      })}

      &.position {
        padding-left: 3px;
        color: #2b89ff;
        font-size: 12px;
      }
    }

    img {
      display: none;
      vertical-align: middle;
      width: 17px;
    
      @media screen and (max-width: 680px) {
        display: inline-block;
      }
    }
  }

  p {
    ${maxLineEllipsisMixin(14, 1.36, 2)}
    color: #999;
  }

  > span {
    display: block;
    margin-top: 2px;
    ${fontStyleMixin({
      size: 14,
      color: '#999'
    })}

    img {
      width: 17px;
      display: inline-block;
      vertical-align: middle;
      margin: -4px 0 0 2px;
    }
  }

  > img {
    position: absolute;
    top: 50%;
    right: 0;
    width: 54px;
    transform: translateY(-50%);
    
    @media screen and (max-width: 680px) {
      display: none;
    }
  }
`;

const AvatarDiv = styled.div<{ img?: string; }>`
  position: absolute;
  left: 0;
  top: 16px;
  width: 105px;
  height: 84px;
  ${({img}) => backgroundImgMixin({
    img: img || ''
  })};
  
  @media screen and (max-width: 680px) {
    left: 15px;
  }
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

const HospitalItem: React.FC<Props> = React.memo(
  (
    {
      slug,
      avatar,
      name,
      position,
      extension: {
        address,
        detail_address,
        telephone
      }
    }
  ) => (
    <Link
      href="/band/[slug]"
      as={`/band/${slug}`}
      passHref
    >
      <HospitalItemLink>
        <AvatarDiv
          img={avatar || staticUrl('/static/images/banner/img-hospital-default.png')}
        />
        <h3>
          <span>{name}</span>
          <img
            src={staticUrl("/static/images/icon/arrow/icon-hospital-arrow.png")}
            alt="더 보기"
          />
          {position && (
            <span className="position">{position}</span>
          )}
        </h3>
        <p>
          {address}{detail_address && `, ${detail_address}`}
        </p>
        <span>
          <img
            src={staticUrl("/static/images/icon/icon-telephone.png")}
            alt="전화번호"
          />
            {telephone}
        </span>
        <img
          src={staticUrl("/static/images/icon/arrow/icon-arrow-link.png")}
          alt="더보기"
        />
      </HospitalItemLink>
    </Link>
  ));

HospitalItem.displayName = 'HospitalItem';

export default HospitalItem;

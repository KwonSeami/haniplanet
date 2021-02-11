import * as React from "react";
import Link from "next/link";
import {staticUrl} from "../../src/constants/env";
import styled from "styled-components";
import {backgroundImgMixin, fontStyleMixin} from "../../styles/mixins.styles";
import {$BORDER_COLOR, $POINT_BLUE} from "../../styles/variables.types";
import KeyWordHighlight from '../common/KeyWordHighlight';

export const HospitalListUl = styled.ul`
  li {
    &:first-child a{
      border-top: 1px solid ${$BORDER_COLOR};
    }
  }
`;

const HospitalItemLink  = styled.a`
  display: block;
  position: relative;
  width: 100%;
  height: 105px;
  padding: 12px 54px 11px 114px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};

  h3 {
    padding-bottom: 15px;

    & > span {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 18,
        weight: '600'
      })}
      
      &.position {
        padding-left: 3px;
        color: #2b89ff;
        font-size: 12px;
      }
    }
    
  }

  p {
    ${fontStyleMixin({
      size: 14,
      color: '#999'
    })}

    span {
      display: block;
      padding-top: 3px;
      ${fontStyleMixin({
        size: 14,
        color: '#999'
      })}

      img {
        width: 20px;
        display: inline-block;
        vertical-align: middle;
        margin: -6px 0 0 -3px;
      }
    }
  }

  & > img {
    width: 54px;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -27px;
  }
`;

const AvatarDiv = styled.div<{img?: string;}>`
  position: absolute;
  left: 0;
  width: 100px;
  height: 80px;
  ${({img}) => backgroundImgMixin({
    img: img || ''
  })};
`;

export interface IHospitalProps {
  slug: string;
  avatar: string;
  name: string;
  extension: {
    address: string;
    detail_address: string;
    telephone: string;
  };
  position?: string;
  className?: string;
  highlightKeyword?: string;
}

export const HospitalItem: React.FC<IHospitalProps> = React.memo((
  {
    slug,
    avatar,
    name,
    position,
    className,
    extension: {
      address,
      detail_address,
      telephone
    },
    highlightKeyword
  }
) => (
  <Link
    href="/band/[slug]"
    as={`/band/${slug}`}
    passHref
  >
    <HospitalItemLink className={className}>
      <AvatarDiv
        img={avatar || staticUrl('/static/images/banner/img-hospital-default.png')}
      />
      <h3>
        <span>
          {highlightKeyword ? (
            <KeyWordHighlight
              text={name}
              keyword={highlightKeyword}
              color={$POINT_BLUE}
            />
          ) : name}
        </span>
        {position && (
          <span className="position">{position}</span>
        )}
      </h3>
      <p>
        {address}{detail_address && `, ${detail_address}`}
        <span>
          <img
            src={staticUrl("/static/images/icon/icon-telephone.png")}
            alt="전화번호"
          />
          {telephone}
        </span>
      </p>
      <img
        src={staticUrl("/static/images/icon/arrow/icon-arrow-link.png")}
        alt="바로가기"
      />
    </HospitalItemLink>
  </Link>
));

HospitalItem.displayName = 'HospitalItem';

import React from 'react';
import styled from 'styled-components'
import {backgroundImgMixin, fontStyleMixin} from "../../styles/mixins.styles";
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $FONT_COLOR} from "../../styles/variables.types";
import {staticUrl} from "../../src/constants/env";
import Link from 'next/link';

export const OverActionWrapper = styled.div`
  position: relative;
  border-top: 1px solid ${$BORDER_COLOR};
  transition: all 0.2s;
  box-sizing: border-box;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0.5px;
    bottom: 0;
    right: 0;
    width: 40px;
    opacity: 0;
    transition: all 0.4s;
    background-color: #f9f9f9;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/arrow/icon-story-unfold-arrow.png'),
      size: '14px 7px',
      position: 'center'
    })};
  }

  &:hover {
    padding-right: 56px;
    border-color: ${$GRAY};
    
    &::before {
      opacity: 1;
    }
  }
  
  &.simple:hover {
    padding-right: 0;
    border-color: ${$BORDER_COLOR};
    cursor: default;
    
    &::before {
      opacity: 0;
    }
  }
`; 

const WrapperDiv = styled.div<Pick<ILinkOverActionWrapperProps, 'hasPlusIcon'>>`
  a {
    position: relative;
    display: block;
    width: 100%;
    height: 248px;

    .see-more {
      position: absolute;
      bottom: 0;
      right: 20px;
      transition: all 0.3s;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        display: block;
        width: 0;
        height: 1px;
        background-color: ${$POINT_BLUE};
        transition: all 0.3s;
      }

      span {
        transition: all 0.3s;
        ${fontStyleMixin({
          size: 12,
          weight: 'normal',
          color: $POINT_BLUE
        })};
        opacity: 0;
      }
  
      i {
        position: absolute;
        top: 2px;
        right: -21px;
        width: 15px;
        height: 15px;
        text-indent: -9999px;
        transition: all 0.3S;
        overflow: hidden;
        ${({hasPlusIcon}) => hasPlusIcon && backgroundImgMixin({
          img: '/static/images/icon/icon-pick-more.png'
        })};
      }
    }
  }

  &:hover {
    .see-more {
      &::after {
        width: 100%;
      }

      span {
        opacity: 1;
      }

      i {
        ${backgroundImgMixin({
          img: '/static/images/icon/icon-pick-more2.png',
        })};
      }
    }
  }
`;

interface ILinkOverActionWrapperProps {
  href: string;
  as: string;
  text: string;
  hasPlusIcon?: boolean;
  children: React.ReactNode;
  target?: Dig<HTMLAnchorElement, 'target'>;
}

export const LinkOverActionWrapper = React.memo<ILinkOverActionWrapperProps>(({
  href,
  as,
  text,
  hasPlusIcon,
  children,
  target = '_blank'
}) => (
  <WrapperDiv hasPlusIcon={hasPlusIcon}>
    <Link
      href={href}
      as={as}
    >
      <a target={target}>
        {children}
        <div className="see-more">
          <span>{text}</span>
          <i>more</i>
        </div>
      </a>
    </Link>
  </WrapperDiv>
));

import styled from 'styled-components';
import {fontStyleMixin, heightMixin, radiusMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $LIGHT_BLUE, $GRAY, $WHITE, $POINT_BLUE} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';

export const ACTIVE_AFTER_STYLE = `
  content:'';
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: -1;
  width: 100%;
  height: 50%;
  background-color: ${$LIGHT_BLUE};
`;

export const MenuUl = styled.ul`
  margin: 17px 0 40px;
  border-top: 2px solid ${$FONT_COLOR};

  li > ul >li {
    background-color: #f9f9f9;
  }
`;

export const MenuLi = styled.li<{on?: boolean;}>`
  width: 100%;
  position: relative;

  &.save-category {
    a {
      margin-top: -1px;
      border-top: 1px solid ${$FONT_COLOR};
    }

    img {
      width: 24px;
      position: absolute;
      right: 5px;
      top: 9px;

      &.on {
        display: none;
      }
    }
  }

  a, div {
    display: block;
    width: 100%;
    position: relative;
    padding: 0 20px;
    box-sizing: border-box;
    ${heightMixin(45)};
    cursor: pointer;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }
  
  span {
    position: relative;
    z-index: 1;
    ${fontStyleMixin({
      size: 14,
      color: '#999'
    })};
  }

  .new {
    width: 19px;
    vertical-align: 2.5px;
    margin-left: 6px;
  }
  
  &.on {
    & > a > span {
      ${fontStyleMixin({
        weight: 'bold',
        color: $FONT_COLOR
      })};
      
      &::after {
        ${ACTIVE_AFTER_STYLE}
      }
    }
  }

  ${({on}) => on && `
    &.save-category img {
      display: none;

      &.on {
        display: block !important;
      }
    }

    .category-title {
      ${fontStyleMixin({
        weight: 'bold',
        color: `${$FONT_COLOR} !important`
      })};

      &::after {
        content:'';
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: -1;
        width: 100%;
        height: 50%;
        background-color: ${$LIGHT_BLUE};
      }
    }

    li {
      background-color: #f9f9f9;

      span {
        ${fontStyleMixin({
          weight: 'normal',
          color: '#999'
        })};
      }
    }
  `}
`;

export const CardMenuUl = styled.ul`
  margin-top: 16px;
  position: relative;
`;

export const CardMenuLi = styled.li<{on?: boolean; bgImg?: string;}>`
  position: relative;
  display: inline-block;
  width: 163px;
  height: 71px;
  vertical-align: middle;
  ${radiusMixin('5px', '#eee')};
  opacity: 0.5;

  &::before {
    content:'';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    border-radius: 5px;
    ${({bgImg}) =>
      backgroundImgMixin({
        img: bgImg || staticUrl('/static/images/banner/img-modunawa-all.jpg'),
        position: 'right'
      })};
    }
  }
  
  a {
    display: block;
    width: 100%;
    height: 100%;
    padding: 10px 0 0 14px;
    box-sizing: border-box;

    b {
      display: inline-block;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold'
      })};
    }

    span {
      margin-left: 2px;
      ${fontStyleMixin({
        size: 15,
        color: $POINT_BLUE,
        weight: '700'
      })};
    }

    img {
      display: none;
    }
  }

  &:hover {
    border: 1px solid ${$GRAY};
    opacity: 1;

    a {
      b, span {
        opacity: 1;
      }
    }
  }

  &.on {
    border: 1px solid ${$GRAY};
    opacity: 1;

    ::before {
      opacity: 1;
    }

    a {
      b, span {
        text-decoration: underline;
        opacity: 1;
      }

      img {
        opacity: 1;
      }
    }
  }
`;

export const SubMenuUl = styled.ul`
  width: 1030px;
  height: 46px;
  display: flex;
  margin: 13px 0 -7px;
  border: 1px solid ${$BORDER_COLOR};
`;

export const SubMenuLi = styled.li`
  width: 100%;
  border-right: 1px solid ${$BORDER_COLOR};
  background-color: #f6f7f9;

  &:last-child {
    border: none;
  }

  &.on {
    background-color: ${$WHITE};

    a span {
      color: ${$POINT_BLUE};
    }
  }

  a {
    width: 100%;
    display: inline-block;
    ${heightMixin(45)};
    border: none;
    box-sizing: border-box;
    padding: 0 17px;

    b {
      ${fontStyleMixin({
        size: 14,
        color: $FONT_COLOR,
        weight: 'bold'
      })};
    }

    span {
      margin-left: 2px;
      ${fontStyleMixin({
        size: 14,
        color: $FONT_COLOR,
        weight: 'bold'
      })};
    }
  }
`;
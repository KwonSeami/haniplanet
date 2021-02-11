import styled from 'styled-components';
import {fontStyleMixin, radiusMixin, backgroundImgMixin, heightMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $WHITE, $POINT_BLUE, $TEXT_GRAY} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';

export const CardMenuUl = styled.ul`
  position: relative;
  max-width: 680px;
  overflow-x: auto;
  margin: 0 auto;
  box-sizing: border-box;

  @media screen and (max-width: 680px) {
    padding: 0 15px;
  }
`;

export const CardMenuLi = styled.li<{on?: boolean; bgImg?: string;}>`
  position: relative;
  display: inline-block;
  width: 111px;
  height: 68px;
  line-height: 18px;
  vertical-align: middle;
  ${radiusMixin('10px', '#eee')};
  box-sizing: border-box;
  overflow: hidden;
  ${props =>
    backgroundImgMixin({
      img: !props.bgImg
        ? staticUrl('/static/images/banner/img-modunawa-all.jpg')
        : props.bgImg,
    })};
  }

  & ~ li {
    margin-left: 3px;
  }

  div {
    width: 100%;
    height: 100%;

    a {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      padding: 11px 30px 0 10px;
      box-sizing: border-box;
  
      p {
        width: 68px;
        word-break: keep-all;
        white-space: normal;
        ${fontStyleMixin({
          size: 14,
          weight: 'bold'
        })};
      }

      span {
        position: absolute;
        top: 11px;
        right: 10px;
        text-decoration: underline;
        text-decoration-color: ${$POINT_BLUE};
        ${fontStyleMixin({
          size: 12,
          color: $POINT_BLUE,
          weight: '700'
        })};
      }
    }
  }

  &.on {
    border: 1px solid ${$GRAY};

    div {
      a p {
        text-decoration: underline;
      }
    }
  }

  ul {
    position: absolute;
    z-index: 1;
    bottom: 12px;
    left: 0;
    height: 28px;

    @media screen and (max-width: 680px) {
      left: 15px;
    }
  }
`;

export const MenuLi = styled.li<{on?: boolean;}>`
  position: relative;
  display: inline-block;
  background-color: #f6f7f9;
  margin-right: 5px;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};

  a {
    display: block;
    padding: 2px 12px 3px;
    position: relative;

    span {
      position: relative;
      z-index: 1;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
        color: '#666'
      })};
    }
  }

  &.on {
    background-color: ${$WHITE};

    & > a > span {
      ${fontStyleMixin({
        weight: '600',
        color: $POINT_BLUE
      })};
    }
  }
`;


export const SubMenuUl = styled.ul`
  margin-top: 12px;
  padding:0 15px;
  @media screen and (min-width: 680px) {
    width: 680px; 
    margin: 12px auto 0; 
  }
`;

export const SubMenuLi = styled.li`
  position: relative;
  display: inline-block;
  background-color: #f6f7f9;
  margin-right: 5px;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};
  ${heightMixin(25)}

  a {
    display: block;
    padding: 0 12px;
    position: relative;

    span {
      position: relative;
      margin-left: 2px;
      z-index: 1;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
        color: $TEXT_GRAY
      })};
    }

    strong,
    span {
      vertical-align: top;  
    }
  }

  &.on {
    background-color: ${$WHITE};

    & > a > span {
      ${fontStyleMixin({
        weight: '600',
        color: $POINT_BLUE
      })};
    }
  }
`;
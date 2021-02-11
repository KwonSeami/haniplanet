import styled from "styled-components";
import Input from "../../inputs/Input";
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $WHITE, $FONT_COLOR} from "../../../styles/variables.types";
import {fontStyleMixin, heightMixin, backgroundImgMixin} from "../../../styles/mixins.styles";
import {staticUrl} from "../../../src/constants/env";

interface ICartProductThumbnailProps {
  size?: Number;
  image?: string;
}

const LAYOUT_WIDTH = 1090;

export const CommonWrapper = styled.div`
  width: ${LAYOUT_WIDTH}px;
  margin: 0 auto;
  padding: 50px 0;

  header {
    position: relative;
    padding: 0 0 20px;
    border-bottom: 1px solid ${$FONT_COLOR};

    h2 {
      display: inline-block;
      line-height: 1;
      ${fontStyleMixin({
        size: 24,
        color: $FONT_COLOR,
        weight: '600'
      })}
    }

    ol {
      float: right;
      padding-top: 8px;
      
      li {
        float: left;
        line-height: 20px;
        ${fontStyleMixin({
          size: 14,
          color: '#999'
        })}

        &.active {
          color: ${$FONT_COLOR};

          em {
            color: ${$POINT_BLUE};
          }
        }

        em {
          padding-right: 4px;
          font-style: normal;
          letter-spacing: 1px;
          vertical-align: bottom;

          ${fontStyleMixin({
            size: 20,
            color: '#bbb',
            family: 'Montserrat'
          })}
        }

        & ~ li {
          margin-left: 15px;
        }
      }
    }
  }

  section {
    & ~ section {
      margin-top: 40px;
    }

    header {
      position: relative;
      padding: 10px 0;
      border-bottom: 1px solid ${$FONT_COLOR};

      h3 {
        padding: 10px 0;
        line-height: 1;
        letter-spacing: -0.27px;
        ${fontStyleMixin({
          size: 16,
          color: $FONT_COLOR,
          weight: 'bold'
        })}
      }

      button {
        position: absolute;
        right: 0;
        bottom: 10px;
        width: 127px;
        height: 34px;
        background-color: ${$FONT_COLOR};
        cursor: pointer;
        ${fontStyleMixin({
          size: 14,
          color: $WHITE
        })}
      }
    }

    .banner {
      margin-top: 22px;
    }
  }

  .btn-group {
    margin-top: 20px;
    font-size: 0;
    text-align: right;

    button {
      width: 155px;
      height: 40px;
      border: 1px solid ${$BORDER_COLOR};
      vertical-align: middle;
      cursor:pointer;
      ${fontStyleMixin({
        size: 15,
        color: '#333',
        weight: '600'
      })}

      & ~ button {
        margin-left: 10px; 
      }

      &.blue {
        border-width: 0;
        background-color: ${$POINT_BLUE};
        color: ${$WHITE};
      }
    }
  }
  .counter {
    height: 35px;
    vertical-align: middle;

    button {
      width: 35px;
    }
  }
  .total-price {
    margin: 20px 0;
    padding: 20px;
    border: 1px solid ${$BORDER_COLOR};
    background-color: #f6f7f9;
    ul {
      text-align: center;
    }
    li {
      display: inline-block;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
    p {
      text-align: center;
      font-size: 14px;
      color: #555;
      white-space: nowrap;
      .price {
        padding: 0 5px;
        ${fontStyleMixin({ size: 18, weight: '600', color: '#111', family: 'Montserrat' })}
        &.red {
          color: #ea0000;
        }
      }
      .sign {
        font-size: 18px;
        font-weight: 800;
      }
    }
  }
`;

export const OrderFormDiv = styled.div`
  dl {
    display: table;
    table-layout: fixed;
    width: 100%;
    border-bottom: 1px solid ${$BORDER_COLOR};
    
    dt {
      display: table-cell;
      width: 180px;
      padding-right: 30px;
      box-sizing: border-box;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 14,
        color: $FONT_COLOR
      })};
      
      &.required::after {
        content: '*';
        margin-left: 4px;
        ${fontStyleMixin({
          size: 11,
          color: '#f32b43'
        })};
      }

      .check-box {
        display: inline-block;
      }
    }
    dd {
      display: table-cell;
      padding: 15px;
    }

    .group {
      & ~ .group {
        margin-top: 10px;
      }

      .radio {
        padding: 6px 0; 

        span {
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    .item {
      position: relative;
      display: inline-block;
      vertical-align: middle;

      & ~ .item {
        margin-left: 10px;
      }

      &.hypen {
        position: relative;

        & ~ .hypen {
          margin-left: 20px;
          &::before {
            position: absolute;
            left: -13px;
            top: 50%;
            width: 6px;
            height: 1px;
            background-color: ${$BORDER_COLOR};
            content: '';
          }
        }
      }

      input:not([type=radio]) {
        width: 240px;

        &.zipcode {
          width: 120px;
        }
      }
    }
    
    .btn {
      width: 120px;
      border: 1px solid ${$BORDER_COLOR};
      font-size: 14px;
      cursor: pointer;
      ${heightMixin(38)};
    }
  }

  input:not([type=radio]) {
    width: 380px;
    padding:0 10px;
    border: 1px solid ${$BORDER_COLOR};
    font-size: 14px;
    ${heightMixin(38)};
  }
  
  > p {
    margin: 10px 0;
    ${fontStyleMixin({
      size: 14,
      color: '#f32b43'
    })};

    strong {
      ${fontStyleMixin({
        color: $POINT_BLUE,
        weight: '500'
      })};
    }
  }

  .text {
    line-height: 38px;
    ${fontStyleMixin({
      size: 14,
      color: $FONT_COLOR
    })}
  }
`;

export const CartTable = styled.table`
  width: 100%;
  
  th {
    height: 40px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 14,
      color: '#333',
      weight: 'bold'
    })}
  }

  td {
    width: 15%;
    padding: 20px 10px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    vertical-align: middle;
    text-align: center;
    line-height: 1.5;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY
    })};

    &.checkbox {
      width: 60px;

      .check-box {
        display: inline-block;
      }
    }

    &.thumbnail {
      width: 150px;
      padding: 20px 0;

      .img {
        width: 100%;
      }
    }
    &.info {
      width: auto;
      padding-left: 30px;
      text-align: left;
    }
  }
  
  em {
    ${fontStyleMixin({
      size: 16,
      color: '#333',
      weight: '600'
    })}
    font-style: normal;

    & + p {
      margin-top: 5px;
    }
  }

  .btn {
    display: inline-block;
    min-width: 50px;
    padding:0 5px;
    margin: 5px;
    border: 1px solid ${$BORDER_COLOR};
    cursor: pointer;
    vertical-align: middle;
    ${heightMixin(25)}
    ${fontStyleMixin({
      size: 12,
      color: $GRAY
    })};

    &-black {
      background-color: ${$FONT_COLOR};
      border-color: ${$FONT_COLOR};
      color: ${$WHITE};
    }
  }

  p {
    & ~ p {
      margin-top: 2px;
    }
  }
  .btn-mini {
    width: 70px;
    border: 1px solid ${$BORDER_COLOR};
    cursor: pointer;
    ${fontStyleMixin({
      size: 12,
      color: $FONT_COLOR
    })}
    ${heightMixin(30)}
  }

  .counter ~ .btn-mini {
    margin-top: 10px;
  }

  .no-content:hover {
    background-color: transparent;
  }
`;

export const StyledInput = styled(Input)`
  width: 380px;
  padding: 0 10px;
  border:1px solid ${$BORDER_COLOR};
  font-size: 14px;
  ${heightMixin(38)};
`;

export const OrderReceiptDiv = styled.div`
  padding: 10px 15px;
  border: 1px solid ${$BORDER_COLOR};
  border-top: 0;
  background-color: #f6f7f9;

  dl {
    padding: 4px 0;

    &.result {
      padding-top: 12px;
      margin-top: 12px;
      border-top: 1px solid ${$BORDER_COLOR};
      
      dt {
        width: 40%;
      }
      dd {
        width: 60%;
      }
    }
  }

  dt, dd {
    display: inline-block;
    vertical-align: top;
    line-height: 22px;
  }

  dt {
    width: 60%;
    ${fontStyleMixin({
      size: 14,
      color: $FONT_COLOR,
      weight: '600'
    })};

    em {
      ${fontStyleMixin({
        size: 18,
      })}
    }
    small {
      ${fontStyleMixin({
        size: 11,
        color: $POINT_BLUE
      })}
    }
  }

  dd {
    width: 40%;
    text-align: right;
    ${fontStyleMixin({
      size: 14,
      color: $FONT_COLOR,
      family: 'Montserrat'
    })};

    .unit {
      font-family: 'Noto Sans KR';
    }

    em {
      letter-spacing: -0.2px;
      ${fontStyleMixin({
        size: 22,
        color: $POINT_BLUE,
        family: 'Montserrat',
        weight: '600'
      })}
    }
  }
  

  em {
    display: inline-block;
    font-style: normal;
  }
`;

export const OrderPartSection = styled.section`
  &::before,
  &::after {
    display: table;
    clear: both;
    content: '';
  }
  
  & > div {
    float:left;
    width: 650px;

    & + div {
      float: right;
      width: 320px;
      margin-top: 0;
    }
  }
`

export const CartThumbnailDiv = styled.div<ICartProductThumbnailProps>`
  ${({size, image}) => `
    width: ${size || 150}px;
    height: ${size || 150}px;
    ${backgroundImgMixin({
      img: image || staticUrl('/static/images/banner/no-image.png')
    })};
  `}
`;

export const AddressPopupWrapper = styled.div`
  & > div {
    max-height: 630px;
    overflow-y: scroll;
    border-bottom: 1px solid ${$BORDER_COLOR};

    /* Mozila */
    scrollbar-width: thin;
    scrollbar-color: ${$BORDER_COLOR} transparent;
    /* IE */
    scrollbar-face-color: #e0e0e0;
    scrollbar-track-color: #fff;
    scrollbar-arrow-color: none;
    scrollbar-highlight-color: #e0e0e0;
    scrollbar-3dlight-color: none;
    scrollbar-shadow-color: #e0e0e0;
    scrollbar-darkshadow-color: none;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: ${$BORDER_COLOR};
    }
    &::-webkit-scrollbar-button {
      width: 0;
      height: 0;
    }
  }

  li {
    position: relative;
    padding: 14px 15px;

    & ~ li {
      border-top: 1px solid ${$BORDER_COLOR};
    }

    h2 {
      line-height: 1.23;
      letter-spacing: -0.43px;
      ${fontStyleMixin({
        size: 17,
        color: $FONT_COLOR,
        weight: 'bold'
      })}
    }

    p {
      letter-spacing: -0.2px;
      ${fontStyleMixin({
        size: 14,
        color: $FONT_COLOR
      })};

      span {
        color: ${$POINT_BLUE};
      }
    }

    h2 + p {
      margin-top: 4px;
    }

    p + p {
      margin-top: 1px;
    }

    button {
      position: absolute;
      right: 15px;
      top: 50%;
      width: 90px;
      ${heightMixin(34)};
      border:1px solid ${$BORDER_COLOR};
      cursor: pointer;
      transition-duration: 200ms;
      transition-property: border-color, color;
      transform: translateY(-50%);
      ${fontStyleMixin({
        color: $FONT_COLOR,
        size: 14
      })};

      &:hover {
        border-color: ${$POINT_BLUE};
        color: ${$POINT_BLUE};
      }
    }
  }

  footer {
    margin-top: 25px;
    text-align: center;

    button {
      width: 200px;
      height: 45px;
      border: 1px solid ${$BORDER_COLOR};
      background-color: #f4f5f6;
      box-sizing: border-box;
      cursor: pointer;
      ${fontStyleMixin({
        size: 14,
        color: $FONT_COLOR
      })};

      img {
        width: 11px;
        margin-left: 6px;
        vertical-align: middle;
      }
    }
  }
`;
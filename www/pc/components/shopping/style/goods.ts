import styled, { keyframes } from 'styled-components';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import {$WHITE, $POINT_BLUE, $FONT_COLOR, $BORDER_COLOR, $TEXT_GRAY, $GRAY} from '../../../styles/variables.types';
import NoContent from '../../NoContent/NoContent';

interface IShoppingItemProps {
  imgSrc: string;
}
interface IWishButtonProps {
  isActive?: boolean;
}

const DETAIL_LAYOUT_WIDTH = 980;

export const MainLayout = styled.div`
  width: 1035px;
  margin: 0 auto;

  &::before, 
  &::after {
    display: table;
    clear: both;
    content: '';
  }
`;

export const MainWrapper = styled.div`
  margin: 30px 0 100px;

  .additional-content {
    .banner {
      margin-bottom: 30px;
      font-size: 0;
    }
    & > button {
      display: none;
    }  
  }

  .top-wrapper {
    > * {
      display: inline-block;
      width: 50%;
      vertical-align: middle;

      & ~ * {
        text-align: right;
      }
    }

    .select-box {
      display: inline-block;
      width: auto;
      min-width: 100px;
      padding-right: 30px;
      border-bottom: 0;

      ul {
        border-top: 1px solid ${$BORDER_COLOR};
        text-align: left;
      }

      & ~ button {
        margin-left: 15px;
      }
    }
  }
`;



export const WishButton = styled.button<IWishButtonProps>`
  width: 100px;
  ${heightMixin(31)};
  border: 1px solid #666;
  border-radius: 4px;
  letter-spacing: -0.4px;
  background-color: ${$WHITE};
  cursor: pointer;
  ${fontStyleMixin({
    size: 14,
    color: $FONT_COLOR
  })};

  img {
    width: 13px;
    margin-right: 2px;
    vertical-align: middle;
  }

  ${({isActive}) => (
    !!isActive && `
      background-color: ${$FONT_COLOR};
      border-color: ${$FONT_COLOR};
      color: ${$WHITE};
    `
  )}
`

export const LeftFeed = styled.div`
  width: 680px;
  float: left;
`;

export const ShoppingBanner = styled.div`
  height: 280px;
  padding-top: 173px;
  box-sizing: border-box;
  ${backgroundImgMixin({
  img: staticUrl('/static/images/banner/banner-shopping.jpg'),
  size: 'cover'
})}

  h2 {
    ${fontStyleMixin({
      size: 30,
      weight: '300',
      color: $WHITE
    })};
  }

  .content {
    position: relative;

    a {
      position: absolute;
      right: 0;
      top: 0;
      width: 158px;
      height: 45px;
      border-radius: 4px;
      background-color: ${$WHITE};
      letter-spacing: -0.2px;
      line-height: 45px;
      text-align: center;
      ${fontStyleMixin({
        size: 16,
        color: $FONT_COLOR,
        weight: 'bold'
      })};

      img {
        height: 14px;
        margin: -2px 2px 0 0;
        vertical-align: middle;
      }
    }
  }

  p {
    margin-top: 5px;
    opacity: 0.7;
    ${fontStyleMixin({
      color: $WHITE,
      size: 16,
      weight: '300'
    })}
  }
`;

export const SearchInput = styled.div`
  position: relative;
  height: 42px;
  margin-bottom: 30px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  input {
    width: 100%;
    height:100%;
    font-size: 15px;
    font-weight: normal;
    line-height: 1.2;
    border: 0;
    box-sizing: border-box;
  }

  input::placeholder {
    color: #2b89ff;
  }
  img {
    width: 28px;
    position: absolute;
    right: 0;
    bottom: 7px;
  }
`;

export const Button = styled.button`
  vertical-align: middle;
  width: 190px;
  height: 44px;
  border-radius: 7px;
  background-color: ${$FONT_COLOR};
  cursor: pointer;
  ${fontStyleMixin({
    size: 14,
    weight: 'bold',
    color: $WHITE
  })};

  img {
    vertical-align: -0px;
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }

  &.meetup-new-btn {
    margin: 0 5px;
    background-color: ${$POINT_BLUE};

    img {
      width: 11px;
      height: 11px;
      margin-right: 5px;
    }
  }
`;

export const StyledNoContent = styled(NoContent)`
  margin: 10px 0;
  padding: 60px 0;
  border-top: 1px solid ${$FONT_COLOR};
  border-bottom: 1px solid ${$BORDER_COLOR};
  text-align: center;
  ${fontStyleMixin({
    size: 14,
    color: $GRAY
  })};

  &:hover {
    background-color: transparent;
  }
`

const scale = keyframes`
  from {
    transform: scale(1.15);
  }

  to {
    transform: scale(1);
  }
`;

export const CheckRegisterBusiness = styled.article`
  padding: 16px 19px;
  margin-bottom: 25px;
  border: 1px solid ${$BORDER_COLOR};

  > p {
    position: relative;
    line-height: 1.7;
    padding-left: 17px;
    ${fontStyleMixin({
      size: 14,
    })};

    &::before {
      content: '※';
      position: absolute;
      top: 0;
      left: 0;
    }

    span {
      color: ${$POINT_BLUE};
    }
  }

  div {
    margin: 7px 0 13px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;

    b {
      display: inline-block;
      margin-right: 12px;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold'
      })};
    }

    p {
      display: inline-block;
      width: 394px;
      ${heightMixin(44)};
      padding: 0 15px;
      margin-right: 12px;
      background-color: #f9f9f9;
      vertical-align: middle;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 13,
        color: $TEXT_GRAY,
      })};
    }

    .button {
      vertical-align: middle;
      
      img {
        width: 15px;
        margin-right: 4px;
        vertical-align: middle;
      }
    }
  }
`;

export const ShoppingListUl = styled.ul`
  margin: 15px -10px;
`;

export const ShoppingItemLi = styled.li<IShoppingItemProps>`
  position: relative;
  display: inline-block;
  vertical-align: top;
  width: 230px;
  padding: 10px;
  box-sizing: border-box;

  .followed.on img {
    bottom: 0;
    opacity: 1;
  }

  &:hover {
    .followed img{
      transform: translateY(0);
      opacity: 1;
    }

    .title {
      .img {
        height: 254px;
        transform: scale(1.2);
        transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      }
    }
  }

  .status-label {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 0 9px;
    height: 26px;
    line-height: 26px;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.6);
    box-sizing: border-box;
    ${fontStyleMixin({ 
      size: 12, 
      color: $WHITE 
    })};
  }

  .followed {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 27px;
    height: 25px;
    cursor: pointer;
    z-index: 1;
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      transform: translateY(5px);
      transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    &.on {
      animation: 0.5s ${scale} cubic-bezier(0.25, 0.1, 0.25, 1);
    }
  }

  .thumbnail {
    position: relative;
    width: 100%;
    height: 210px;
    overflow: hidden;
    box-sizing: border-box;

    .img {
      width: 100%;
      height: 100%;
      transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      ${props => backgroundImgMixin({ 
        img: (props.imgSrc || staticUrl('/static/images/banner/no-image.png')), 
        position: 'center', 
        size: '100% 100%' 
      })}
    }

    &-text {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 13px;
      box-sizing: border-box;

      p {
        padding: 1px 0 10px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        ${fontStyleMixin({ 
          size: 13, 
          color: $BORDER_COLOR
        })}
      }
    }
  }

  .contents {
    padding: 8px 0;
    border-top: 0;
    box-sizing: border-box;
  
    h3 {
      box-sizing: border-box;
      letter-spacing: -.2px;
      line-height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; 
      -webkit-box-orient: vertical;
      ${fontStyleMixin({
        size: 14, 
        color: $FONT_COLOR,
        weight: '500'
      })};   
    }

    small {
      margin-top: 4px;
      line-height: 1.5;
      letter-spacing: -.17px;
      ${fontStyleMixin({
        size: 12,
        color: '#999'
      })};
    }

    .price {
      margin-top: 4px;
      ${fontStyleMixin({ 
        size: 12, 
        weight: '600', 
      })}
      
      p {
        line-height: 1;
      }

      em {
        font-style: normal;
        line-height: 1.22;
        letter-spacing: -.3px;
        ${fontStyleMixin({
          size: 18,
          weight: '600',
          family: 'Montserrat'
        })}
      }
      
      del {
        letter-spacing: -.2px;
        ${fontStyleMixin({
          color: '#bbb',
          family: 'Montserrat'
        })}

        .unit {
          color: inherit;
        }
      }

      .unit {
        margin-left: 1px;
        ${fontStyleMixin({
          size: 12,
          family: 'Noto Sans KR',
          color: $FONT_COLOR
        })};
      }

      .percentage {
        margin-right: 2px;
        letter-spacing: -0.17px;
        ${fontStyleMixin({
          size: 12,
          color: '#f32b43',
          family: 'Montserrat',
          weight: '600'
        })};
      }

      .text {
        margin-bottom: 2px;
        line-height: 1.27;
        letter-spacing: -.16px;
        ${fontStyleMixin({
          size: 11,
          family: 'Noto Sans KR'
        })}
      }

      .point {
        color: ${$POINT_BLUE};
      }

      i {
        display: inline-block;
        width: 31px;
        height: 16px;
        margin-top: -5px;
        margin-left: 3px;
        padding-left: 6px;
        line-height: 16px;
        box-sizing: border-box;
        font-style: normal;
        letter-spacing: -.16px;
        vertical-align: middle;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/icon-goods-tag.png')
        })};
        ${fontStyleMixin({
          size: 11,
          color: $WHITE,
          family: 'Montserrat'
        })};
      }
    }
  }

  div.tag {
    padding: 5px 0;

    ul {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      li {
        display: inline;
         
         p {
          font-size: 12px;
         }
        .pointer{
          display: inline;
          vertical-align: 0;
          padding: 0;
          margin-right: 8px;
        }
      }
    }
  }
`;

export const GoodsDetailWrapperDiv = styled.div`
  width: ${DETAIL_LAYOUT_WIDTH}px;
  margin: 20px auto 50px;

  .arrow-slider {
    .slider-btn {
      width: 40px;
      height: 40px;
      background-color: #000;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/arrow/arrow-light_gray-left.png'),
        size: '13px auto'
      })};
      
      &::before {
        display: none;
      }

      &.slider-next {
        transform: translateY(-50%) rotate(180deg);
      }
    }
  }
  
  table {
    th, td {
      text-align: left;
    }
  }
  
  .images {
    display: inline-block;
    width:440px;
    vertical-align: top;
    
    .img {
      width: 100%;
      height: 440px;
    }
    .thumbnails {
      margin-top: 10px;
      text-align: center;

      li {
        display: inline-block;
        margin-right: 8px;
        cursor: pointer;
        :last-child {
          margin-right: 0;
        }
      }
      .img {
        position: relative;
        width: 52px;
        height: 52px; 
        box-sizing: border-box;

        &::after {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: #000;
          opacity: 0.3;
          content: '';
        }
        
        &.on {
          &::after {
            display: none;
          }
        }
      }
    }
  }
  .basic-info-text {
    display: inline-block;
    width: 480px;
    padding: 20px 0 0 60px;
    vertical-align: top;

    h2 {
      position: relative;
      margin-bottom: 18px;
      padding-right: 25px;
      font-size: 20px;
      line-height: 1.2;

      span {
        position: absolute;
        right: 0;
        top: -2px;
        display: inline-block;
        height: 23px;
        cursor: pointer;

        img {
          width: auto;
          height: 100%;
        }
      }
    }
    .price-area {
      color: ${$FONT_COLOR};

      dl {
        & ~ dl {
          margin-top: 4px;
          padding-top: 4px;
          border-top: 1px solid ${$BORDER_COLOR};
        }
      }

      dt, dd {
        display: inline-block;
        width: 50%;
        padding: 4px 0;
        line-height: 20px;
        vertical-align: top;
      }

      dt {
        letter-spacing: -.22px;
        ${fontStyleMixin({
          size: 13,
          color: $FONT_COLOR
        })}
      }

      dd {
        text-align: right;
        ${fontStyleMixin({
          size: 20,
          family: 'Montserrat',
          weight: '500'
        })}

        & > * {
          font-family: inherit;
        }
      }

      strong {
        ${fontStyleMixin({
          color: $FONT_COLOR,
          weight: 'normal'
        })};
      }

      del {
        color: #bbb;
      }

      small {
        margin-right: 3px;
        ${fontStyleMixin({
          size: 13,
          color: $GRAY,
          weight: 'normal'
        })};
      } 

      em {
        color: ${$POINT_BLUE};
        font-style: normal;
      }

      i {
        position: relative;
        top: -2px;
        display: inline-block;
        width: 31px;
        height: 16px;
        margin-right: 4px;
        padding-right: 6px;
        line-height: 16px;
        box-sizing: border-box;
        font-style: normal;
        letter-spacing: -.16px;
        vertical-align: middle;
        text-align: right;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/icon-goods-tag--right.png')
        })};
        ${fontStyleMixin({
          size: 11,
          color: $WHITE,
          family: 'Montserrat'
        })};
      }

      .unit {
        font-family: 'Nato Sans KR';
      }

      .price {
        font-family: 'Montserrat';
      }

      .percentage {
        color: #f32b43;
      }
      
      p {
        border-top: 1px solid ${$BORDER_COLOR};
        padding-top: 8px;
        ${fontStyleMixin({
          size: 12,
          color: $POINT_BLUE
        })}

        em {
          ${fontStyleMixin({
            size: 13,
            weight: '600'
          })};
          color: inherit;
        }
      }
    }
    table {
      margin: 13px 0 20px;
      border-top: 1px solid ${$FONT_COLOR};
      border-bottom: 1px solid ${$BORDER_COLOR};
      tr:last-child {
        th, td {
          border-bottom: none;
          }
      }
      th {
        padding: 8px 16px;
        border-bottom: 1px solid #eee;
        background-color: #fafafa;
        color: #111;
        ${fontStyleMixin({
          size: 12,
          weight: '400'
        })}
      }
      td {
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        border-right: none;
        border-left: none;
        border-top: none;
        line-height: 17px;
        color: ${$FONT_COLOR};
        font-size: 14px;

        &.select {
          padding: 4px 16px 12px 16px;

          p {
            width: 280px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          li {
            height: auto;
            padding: 12px 14px;
            line-height: 1.2;
          }
        }

        small {
          display: inline-block;
          margin-left: 6px;
          ${fontStyleMixin({
            size: 11,
            color: '#999'
          })}
        }
        .select-box {
          p {
            line-height: 44px;
          }
        }
      }
    }

    .sold-out {
      width: 100%;
      
      text-align: center;
      ${fontStyleMixin({
        size: 16,
        color: '#999'
      })}
    }

    .banner {
      margin-top: 10px;
    }
  }
  .tab-waypoint {
    position: relative;
    div {
      position: absolute;
      top: -60px;
    }
  }
  .tabs {
    margin-top: 30px;
    height: 57px;
    ul {
      &.fixed {
        position: fixed;
        top: 120px;
        left: 50%;
        margin-left: -${DETAIL_LAYOUT_WIDTH / 2}px;
        width: ${DETAIL_LAYOUT_WIDTH}px;
        z-index: 3;
      }
      li {
        display:inline-block;
        width: 33.333333%;
        color: #555;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        border: 1px solid #ccc;
        border-top: 2px solid #555;
        background-color: #fafafa;
        box-sizing: border-box;
        cursor: pointer;
        a {
          padding:15px;
          width: 100%;
          display: block;
          box-sizing: border-box;
        }
        
         &.on {
          color: #111;
          border-bottom-color: #fff;
          background-color: #fff;
         }
         &:first-child ~ li {
          border-left: 0;
         }
         
         span {
          font-size: 14px;
         }
      }
    } 
  }
  .tab-section {
    & ~ .tab-section {
      margin-top: 50px;
    }
    table {
      tr:first-child {
        th, td {
          border-top: 1px solid #eee;
        }
      }
      th {
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        background-color: #fafafa;
        color: #111;
        font-weight: 400;
        font-size: 13px;
      }
      td {
        padding: 12px 16px;
        color: #333;
        border-bottom: 1px solid #eee;
        border-right: none;
        border-left: none;
        border-top: none;
        line-height: 21px;
        font-size: 13px;
      }
    }

    .comment-write {
      border-top: 1px solid ${$BORDER_COLOR};
    }

    .comment-item .comment-write {
      border-top: 0;
    }

    .detail {
      padding: 20px 0;
      img {
        display: block;
        margin:0 auto;
      }

      p {
        margin-top: 20px;
      }
    }

    .tables {
      table {
        width: 100%;
        border: 1px solid #eee;
        border-top: 0;
        border-bottom: 0;
      }
    }

  }
  h3 { 
    position: relative;;
    margin-top: 26px;
    margin-bottom: 14px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    span {
      position: absolute;
      top: -200px;
    }
  }
  h4 {
    margin-top: 30px;
    padding-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
  }
  .order-btn {
    width: 333px; 
    background-color: ${$FONT_COLOR};
    cursor: pointer;
    ${heightMixin(40)}
    ${fontStyleMixin({
      color: $WHITE,
      size: 15
    })}
    

    &.buy {
      border: 0;
      background-color: ${$POINT_BLUE};
      color: ${$WHITE};
    }

    &-group {
      font-size: 0;

      div {
        display: inline-block;
        vertical-align: middle;

        & ~ div {
          margin-left: 10px;
        }
      }
    }
  }

  .kakao {
    a {
      display: inline-block;
      background-color: #FBE902;
      padding: 2px 8px 3px;
      font-size: 12px;
      
      &::before {
        content: '';
        width: 13px;
        height: 13px;
        display: inline-block;
        vertical-align: middle;
        margin: -2px 2px 0 0;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/icon-kakao.png')
        })}
      }
    }
  }
`;

export const ReviewWrapperDiv = styled.div`
  & > article {
    font-size: 0;
    border-bottom: 1px solid ${$BORDER_COLOR};

    & > div {
      display: inline-block;
      width: 33.3%;
      padding:0 30px;
      vertical-align: middle;
      box-sizing: border-box;
      font-size: 14px;
    }
  }

  .gauge {
    &-detail {
      dl {
        display: table;
        table-layout: fixed;
        width: 100%;

        & ~ dl {
          margin-top: 10px;
        }
      }
      dt, dd {
        display: table-cell;
        font-size:14px;
        vertical-align: middle;
      }
  
      dt {
        width: 80px;
        padding-right: 20px;
        color: #333;
        font-weight: 500;
        text-align: right;
        box-sizing: border-box;
      }
    }
    &-average {
      width: 28%;
      ul.off li {
        span {
          color: ${$TEXT_GRAY};
        }
      }
      
      li {
        display: inline-block;
        width: 50%;

        img {
          vertical-align: middle;
          width: 15px;
          height: 15px;
          margin-right: 3px;
          padding-top: 3px;
        }

        p {
          display: inline-block;
          vertical-align: middle;
          padding-top: 3px;
          ${fontStyleMixin({
            size: 14,
            weight: '800'
          })};
          
          span {
            padding-left: 4px;
            ${fontStyleMixin({
              weight: '800',
              color: $POINT_BLUE
            })};
          }
        }

        & + li {
          text-align: right;
          
          p {
            display: inline-block;
            vertical-align: middle;
            ${fontStyleMixin({
              size: 12,
              weight: '600',
              color: $POINT_BLUE
            })};
          }

          span {
            vertical-align: middle;
            margin-left: 6px;
            ${fontStyleMixin({
              size: 39,
              weight: '300',
              color: $POINT_BLUE,
              family: 'Montserrat'
            })};
          }
        }
      }
    }
  }
`;
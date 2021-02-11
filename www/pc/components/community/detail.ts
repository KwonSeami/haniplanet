import styled from 'styled-components';
import {fontStyleMixin, backgroundImgMixin, heightMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $FONT_COLOR, $WHITE, $BORDER_COLOR, $POINT_BLUE, $GRAY} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import {NoContent} from '../../components/meetup/pcStyledComp';


interface IFeedListStyle {
  col?: number;
}

export const StyleNoContent = styled(NoContent)`
  border-top: 1px solid ${$FONT_COLOR};
`

export const DetailWrapperDiv = styled.div`
  position: relative;

  .detail-wrapper {
    margin: 54px 0;
  }

  nav.category {
    position: absolute;
    top: -10px;
    font-size: 0;
    transform: translateY(-100%);
    
    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      line-height: 16px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};

      &:first-child {
        font-size: 0;
      }

      & ~ li {
        margin-left: 18px;

        &::before {
          content: '';
          position: absolute;
          left: -18px;
          width: 18px;
          height: 100%;
          text-align: center;
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/arrow/arrow-right-light_gray6x13.png'),
            size: 'auto 13px'
          })}
        }
      }

      img, em {
        vertical-align: middle;
      }

      em {
        height: 100%;
        padding:0 4px;
        color: ${$WHITE};
        font-style: normal;
        border-radius: 4px;
        background: linear-gradient(277deg, #55daba 80%, #78d899 20%);
      }
    }
  }

  .story-reply {
    button {
      display: block;
      width: 240px;
      margin: 18px auto;
      ${heightMixin(42)};
      ${fontStyleMixin({
        size: 14,
        color: '#999'
      })};
      border: 1px solid #999;
      border-radius: 4px;
      cursor: pointer;

      img {
        vertical-align: middle;
        width: 14px;
        margin-left: 4px;

        &.reverse {
          transform: rotate(180deg);
          transform-origin: 50% 35%;
        }
      }
      em {
        font-style: normal;
        color: ${$POINT_BLUE};
      }
    }
  }

  section {
    & ~ section {
      margin-top: 40px;
    }

    & > header {
      position: relative;
      margin-bottom: 15px;

      h3 {
        display: inline-block;
        vertical-align: middle;
        line-height: normal;
        ${fontStyleMixin({
          size: 18,
          color: '#666'
        })};
      }

      p {
        display: inline-block;
        margin-left: 16px;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 14,
          color: $TEXT_GRAY,
          weight: '500'
        })};

        span {
          position: relative;
          float: left;
          cursor: pointer;

          &.active {
            color: ${$POINT_BLUE};
            text-decoration: underline;
          }

          & ~ span {
            margin-left: 17px;

            &::before {
              content: '';
              position: absolute;
              top: 50%;
              left: -8px;
              width: 1px;
              height: 9px;
              background-color: ${$BORDER_COLOR};
              transform: translateY(-50%);
            }
          }
        }
      }

      nav {
        position: absolute;
        top: 0;
        right: 0;

        &::before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 1px;
          height: 27px;
        }

        small {
          vertical-align: middle;
          line-height: 17px;
          ${fontStyleMixin({
            size: 11,
            color: $TEXT_GRAY
          })};
        }
      }

      .page {
        & > span {
          display: inline-block;
          vertical-align: middle;
          ${fontStyleMixin({
            size: 12,
            weight: '300',
            color: $FONT_COLOR,
            family: 'Montserrat'
          })};

          & ~ span {
            margin-left: 10px;
            font-size: 0;
          }
        }  

        img {
          width: 25px;
          cursor: pointer;

          & ~ img {
            margin-left: 4px;
          }
        }
      }
    }
  }
`;

export const LeftFeedDiv = styled.div`
  position: relative;
  float: left;
  width: 680px;
`

export const RightFeedDiv = styled.div`
  float: right; 
  width: 320px;

  & > div {
    & ~ div {
      margin-top: 20px;
    }
  }
`

export const FeedListUl = styled.ul<IFeedListStyle>`
  display: block !important;
  width: auto !important;
  margin: 0 -4px;

  li {
    display: inline-block;
    width: 25%;
    padding: 0 4px;
    box-sizing: border-box;
    overflow: hidden;
    
    ${props => (
      props.col && `width: ${100 / props.col}%`
    )}
  }
`;

export const FeedGalleryDiv = styled.div`
  position: relative;
  width: 100%;
  height: 198px;

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${$GRAY};
    z-index: 0;

    &::after {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      opacity: 0.5;
      transition: all 300ms;
      z-index: 1;
      content: '';
    }

    img {
      height: 100%;
    }
  }

  &.active .background::after {
    background-color: rgba(147, 167, 193, 0.6);
  }
  

  &:hover:not(.active) {
    .background::after {
      opacity: 0.2;
    }
  }

  .content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 17px 14px;
    box-sizing: border-box;
    z-index: 2;

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3; 
      -webkit-box-orient: vertical;
      ${fontStyleMixin({
        size: 15, 
        color: $WHITE
      })};
    }

    small {
      position: absolute;
      left: 14px;
      bottom: 17px;
      line-height: 1.5;
      ${fontStyleMixin({
        size:12,
        color: $WHITE
      })}
    }
  }
`;

export const BoardWrapperDiv = styled.div`
  width: 100%;
  border: 1px solid #eee;
  border-top-color: #999;

  header {
    position: relative;
    padding: 10px 15px;
    background-color: #fbfbfb;
    line-height: 25px;

    h3 {
      display: inline-block;
      letter-spacing: -0.2;
      ${fontStyleMixin({
        size: 15,
        color: $FONT_COLOR
      })}
    }
    
    nav {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0;
      
      span {
        display: inline-block;
        vertical-align: middle;
      }

      img {
        height: 14px;
        vertical-align: middle;

        &.reverse {
          transform: rotate(180deg);
        }
      }

      .count {
        margin: 0 5px;
        ${fontStyleMixin({
          size: 12,
          color: $FONT_COLOR
        })}
      }
    }
  }

  & > div {
    padding: 0 14px;
    box-sizing: border-box;
  }
`;

export const StoryReplyUl = styled.ul`
  border: 1px solid ${$BORDER_COLOR};

  li {
    padding: 16px 36px;
    & ~ li {
      border-top: 1px solid ${$BORDER_COLOR};
    }

    h3 {
      position: relative;
      line-height: 21px;
      ${fontStyleMixin({
        size: 16,
        color: $FONT_COLOR
      })}

      &::before {
        position: absolute;
        left: -16px;
        top: 2px;
        width: 10px;
        height: 10px;
        border: 3px solid ${$BORDER_COLOR};
        border-top: 0;
        border-right: 0;
        content: '';
      }

      i {
        margin-right: 4px;
        font-style: normal;
        ${fontStyleMixin({
          size: 13,
          color: $TEXT_GRAY,
          family: 'Montserrat'
        })};
      }
    }

    p {
      margin-top: 2px;
      line-height: 19px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};

      em {
        ${fontStyleMixin({
          size: 13,
          color: $FONT_COLOR
        })};
        font-style: normal;
      }
      
      .doctor {
        color: #7fc397
      }
    }

    .icons {
      display: block;
      margin-top: 8px;
      line-height: 14px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY,
        family: 'Montserrat'
      })}

      span {
        vertical-align: top;

        & ~ span {
          margin-left: 4px;
        }
      }

      img {
        height: 14px;
        margin-right: 2px;
        vertical-align: top;
      }
    }
  }
`;
import styled from 'styled-components';
import {fontStyleMixin, heightMixin } from '../../styles/mixins.styles';
import {$TEXT_GRAY, $FONT_COLOR, $WHITE, $BORDER_COLOR, $POINT_BLUE} from '../../styles/variables.types';
import {DetailFeedTitle, MoreBtn} from '../../components/story/common';
import {UserButtonList} from '../../components/story/StoryReaction';
import ReceivedPointArea from '../story/extension/point/ReceivedPoint/ReceivedPointArea';
import NoContent from '../NoContent/NoContent';

interface IFeedListStyle {
  col?: number;
}

export const StyleNoContent = styled(NoContent)`
  border-top: 1px solid ${$FONT_COLOR};
`

export const DetailLayoutDiv = styled.div`
  max-width: 680px;
  margin: 0 auto;

  @media screen and (min-width: 680px) {
    margin-top: 20px;
  }

  @media screen and (max-width: 680px) {
    .hani-renderer {
      padding: 14px 15px 23px;

      > div {
        margin: 0 -15px;
      }
    }
  }
`;

export const DetailWrapperDiv = styled.div`
  @media screen and (min-width: 680px) {
    padding-bottom: 40px;
    background-color: #f2f3f7;

    ${DetailFeedTitle} {
      padding: 20px 21px 23px;

      .info-box {
        margin-top: 13px;
        padding-left: 45px;
      }
    }

    ${UserButtonList} {
      padding: 14px 15px;
    }

    ${MoreBtn} {
      right: 15px !important;
    }

    .story-body {
      padding: 20px 30px 12px 30px;
    }
    .canSendPoint {
      padding: 15px;
    }

    .comment-area {
      border-left: 0;
      border-right: 0;
    }

    .fold-btn {
      border-top: 0 !important;
      border-bottom: 1px solid ${$BORDER_COLOR};
    }
  }

  & > .category {
    ${heightMixin(35)};
    background-color:#fbfbfc;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    
    ul {
      &::after {
        display: table;
        clear: both;
        content: '';
      }
    }

    li {
      float: left;
      padding: 0 10px;
      ${fontStyleMixin({
        size: 12,
        color: '#999'
      })}

      &:first-child {
        background-color: ${$WHITE};
      }

      & ~ li {
        border-left: 1px solid #eee;
      }

      em {
        color: #3db871;
        font-style: normal;
      }

      img {
        width: 14px;
        margin: 0 5px;
        vertical-align: middle;
      }
    }
  }

  .story-detail-wrapper {
    border: 1px solid ${$BORDER_COLOR};
    border-top-color: ${$FONT_COLOR};
    border-bottom: 0;

    @media screen and (max-width: 680px) {
      border: 0;
      border-bottom: 1px solid ${$BORDER_COLOR};
    }

    .tag {
      padding: 0 30px 6px;

      @media screen and (max-width: 680px) {
        padding: 0 15px 6px;
      }
    }

    ${ReceivedPointArea} {
      padding: 9px 15px 10px;
    }
  }
  
  .best-story-wrapper {
    margin-top: 24px;
    
    @media screen and (max-width: 680px) {
      margin: 0;
      border-top: 10px solid #f2f5f7;
    }

    header {
      border-bottom: 0;

      & ~ p {
        margin: 0;
        border-top: 1px solid ${$BORDER_COLOR};
      }

      & ~ div {
        padding: 12px 0 0;

        ul {
          padding: 0;
          text-align: left;
        }

        @media screen and (max-width: 680px) {
          padding: 12px 0 2px;
          border-top: 1px solid ${$BORDER_COLOR};

          ul {
            padding: 0 5px 0 10px;
          }
        }
      }
    }
  }

  section {
    .fold-icon-btn {
      display: none;
    }
    .reaction-more-wrap {
      .comment-area {
        margin-bottom: 0;
      }
    }
    .fold-btn {
      display: none;
      border-top: 1px solid ${$BORDER_COLOR};
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

  .board {
    border: 1px solid #eee;
    border-top-color: #999;

    header {
      border: 0;
      border-bottom: 1px solid #eee;
    }
  }

  .floating {
    &-container {
      right: -25px;
    }
  }
`

export const FeedListUl = styled.ul<IFeedListStyle>`
  margin: 0 -4px;
  &::after {
    display: table;
    clear: both;
    content: '';
  }

  li {
    float: left;
    width: 25%;
    padding: 0 4px;
    box-sizing: border-box;
    overflow: hidden;
    
    ${props => (
      props.col && `width: ${100 / props.col}%`
    )}
  }
`;

export const FeedGalleryLi = styled.li`
  position: relative;
  display: inline-block;
  vertical-align: top;
  width: 165px;
  height: 170px;
  padding-right: 5px;
  white-space: normal;
  text-align: left;
  box-sizing: border-box;

  & > a {
    display: block;
    width: 100%;
    height: 100%;
  }

  div {
    position: relative;
    height: 100%;
    padding: 16px 18px 18px 14px;
    background-color: ${$WHITE};
    box-sizing: border-box;

    i {
      position: absolute;
      top: 0;
      right: 0;
      width: 24px;
      height: 24px;
      background-color: #c6dfff;
      text-align: center;
      line-height: 25px;
      font-style: normal;
      ${fontStyleMixin({
        family: 'Montserrat',
        size: 12,
        color: $WHITE
      })}
    }

    .tag {
      display: block;
      margin-bottom: 2px;
      line-height: 18px;
      font-size: 12px;
      color: ${$POINT_BLUE};
    }

    h3 {
      margin-bottom: 4px;
      line-height: 20px;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3; 
      -webkit-box-orient: vertical;
      ${fontStyleMixin({
        size: 15,
        color: $FONT_COLOR
      })};
      overflow: hidden;
    }

    small {
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};
    }

    .icons {
      position: absolute;
      left: 16px;
      bottom: 18px;
      line-height: 14px;
      opacity: 0.6;

      img {
        display: inline-block;
        vertical-align: top;
        width: 14px;
        margin-right: 2px;
      }

      span {
        ${fontStyleMixin({
          size: 12,
          color: $FONT_COLOR,
          family: 'Montserrat'
        })};

        & ~ span {
          margin-left: 4px;
        }
      }
    }
  }
`;

export const BestListUl = styled.ul`
  position: relative;
  border-top: 1px solid ${$FONT_COLOR};
  border-left: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  
  &::after {
    display: table;
    clear: both;
    content: '';
  }

  li {
    position: relative;
    float: left;
    width: 50%;
    padding: 15px 20px;
    padding-left: 36px;
    border-right: 1px solid ${$BORDER_COLOR};
    border-bottom: 1px solid ${$BORDER_COLOR};
    background-color: ${$WHITE};
    box-sizing: border-box;

    i {
      position: relative;
      line-height: 16px;
      font-style: normal;
      ${fontStyleMixin({
        size: 12,
        color: $POINT_BLUE
      })};

      span {
        position: absolute;
        left: -9px;
        top: 0;
        transform: translateX(-100%);        
        ${fontStyleMixin({
          size: 14,
          color: '#c6dfff'
        })};
      }
    }

    p {
      margin-top: 4px;
      overflow: hidden; 
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 20px;
      ${fontStyleMixin({
        size: 15,
        color: $FONT_COLOR
      })}
    }

    small {
      margin-top: 2px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
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
  padding: 5px;
  padding-bottom: 0;
  background-color: #f2f3f7;

  li {
    padding: 12px 15px 12px 27px;
    background-color: ${$WHITE};
    line-height: 21px;
    ${fontStyleMixin({
      size: 14,
      color: $FONT_COLOR
    })};

    & ~ li {
      margin-top: 2px;
    }

    p {
      position: relative;

      &::before {
        position: absolute;
        top: 4px;
        left: -12px;
        width: 8px;
        height: 8px;
        border: 3px solid ${$BORDER_COLOR};
        border-top: 0;
        border-right: 0;
        content: '';
      }
    }

    i {
      margin-right: 4px;
      font-style: normal;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}
    }
  }
`;

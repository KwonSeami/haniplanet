import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $GRAY, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import {inlineBlockMixin, maxLineEllipsisMixin, heightMixin, fontStyleMixin} from '../../styles/mixins.styles';
import Button from '../inputs/Button';
import * as React from 'react';
import {IStory} from '../../src/@types/story';
import {NoticeProps} from '../UI/Card/StoryLabelCard';
import HaniRenderer from '../editor/HaniRenderer';
import TitleCard from '../UI/Card/TitleCard';

export const LinkH2 = styled.h2`
  margin-bottom: -3px;
  padding-top: 10px;
  font-size: 12px;

  span {
    padding-right: 4px;
    color: ${$POINT_BLUE};
    font-weight: bold;
    letter-spacing: 0;
  }

  img {
    ${inlineBlockMixin(11)};
    margin: -4px 0 0 5px;
  }

  @media screen and (max-width: 680px) {
    padding-top: 6px;
  }
`;

export const MoreBtn = styled.button<Pick<NoticeProps, 'is_notice'>>`
  position: absolute;
  right: 0;
  top: 10px;
  z-index: 1;
  

  img {
    width: 27px;
  }

  @media screen and (max-width: 680px) {
    right: 15px;
    top: 13px;

    &.show-label {
      top: 38px;
    }
  }

  ${props => props.is_notice && `
    top: 35px;
  `}
`;

export const TransBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const LayerPopUpUl = styled.ul`
  position: absolute;
  right: 0;
  top: 14px;
  z-index: 2;
  background-color: ${$WHITE};
  border-bottom: 1px solid ${$BORDER_COLOR};

  li {
    position: relative;
    width: 230px;
    padding: 13px 15px 12px 45px;
    box-sizing: border-box;
    border: 1px solid ${$BORDER_COLOR};
    border-bottom: 0;
    font-size: 14px;
    

    span {
      display: block;
      color: #999;
      font-size: 12px;
    }

    img {
      position: absolute;
      left: 14px;
      top: 16px;
      width: 24px;
    }

    &:active, &:hover {
      background-color: #f9f9f9;
    }
  }
`;

export const StoryLabelP = styled.p`
  ${fontStyleMixin({
    size: 12,
    color: $TEXT_GRAY
  })};
`;

export const CenterWrapper = styled.div`
  position: relative;
  max-width: 680px;
  margin: 0 auto;
  box-sizing: border-box;
`;

export const FeedTitle = styled.article<Pick<IStory, 'user'> & Pick<NoticeProps, 'is_notice'>>`
  position: relative;

  ${CenterWrapper} {
    padding: 12px 0;

    @media screen and (max-width: 680px) {
      padding: 12px 15px;
    }
  }
  
  .title {
    position: relative;
    display: inline-flex;
    max-width: 100%;
    height: 100%;
    align-items: center;

    &.new::after {
      content: '';
      position: absolute;
      top: 2px;
      right: -6px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: ${$POINT_BLUE};
    }

    h2 {
      &, a {
        font-size: 15px;
        line-height: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      span {
        display: inline-block;
        vertical-align: middle;
        margin: -3px 4px 0 0;
        line-height: 18px;
        ${fontStyleMixin({
          size: 12,
          color: '#999'
        })}
      }
    }
  }

  .label-exist {
    .guide-label {
      margin-left: 4px;
      line-height: 15px;
      color: ${$FONT_COLOR};
      white-space: nowrap;
    }
  }
  
  .attrs {
    margin-top: 2px;
    font-size: 0;

    .avatar {
      margin: 0;
    }
  }
`;

export const DetailFeedTitle = styled.div<Pick<IStory, 'user'>>`
  position: relative;
  padding: 12px 0;
  border-bottom: 1px solid #eee;

  .onclass-user {
    color: ${$GRAY};
    font-size: 12px;
    margin: 0 4px;
  }
  .label-exist {
    display: inline-flex;
    max-width: 100%;
    height: 100%;
    align-items: center;

    .guide-label {
      margin-left: 4px;
      line-height: 15px;
      color: ${$FONT_COLOR};
      white-space: nowrap;
    }
  }

  h2 {
    line-height: 24px;
    font-size: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    .onclass-notice-label {
      display: inline-block;
      width: 33px;
      ${heightMixin(22)};
      margin-right: 8px;
      border-radius: 11px;
      background-color: #f32b43;
      box-sizing: border-box;
      text-align: center;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        color: $WHITE,
      })};
    }

    .onclass-subject {
      display: inline-block;
      margin-right: 3px;
      ${fontStyleMixin({
        size: 18,
        color: $TEXT_GRAY,
      })};
    }

    .qa-status {
      display: inline-block;
      width: 46px;
      height: 16px;
      line-height: 16px;
      margin-right: 8px;
      text-align: center;
      background-color: #eee;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 11,
        color: '#999'
      })};

      &.on {
        color: ${$POINT_BLUE};
        background-color: ${$WHITE};
        border: 1px solid #499aff;
      }
    }
  }

  .info-box {
    position: relative;
    margin-top: 7px;
    padding-left: 38px;

    .attrs {
      margin-bottom: 1px;

      .onclass-owner-icon {
        width: 18px;
        margin-right: 2px;
        vertical-align: text-top;
      }

      .avatar {
        display: inline-block;

        .cropped-image {
          position: absolute;
          top: 3px;
          left: 0;
        }
      }

      .label {
        display: block;
      }
    }

    > span {
      color: ${$TEXT_GRAY};
    }
  }

  @media screen and (max-width: 680px) {
    padding: 12px 15px;
  }
`;

export const StyledTitleCard = styled(TitleCard)`
  border-top: 0;
  border-bottom: 10px solid #f2f3f7;

  .file {
    margin: 0 30px;

    @media screen and (max-width: 680px) {
      margin: 0 15px;
    }
  }

  ul.tag {
    padding: 6px 0 7px;

    li {
      padding-bottom: 6px;
    }

    @media screen and (max-width: 680px) {
      padding: 6px 15px 7px;
    }
  }

  .reaction-more-wrap {
    position: relative;

    .comment-area {
      margin-bottom: 14px;
      border-top: 1px solid ${$BORDER_COLOR};

      @media screen and (max-width: 680px) {
        margin-bottom: 0;
        border: 0;
        border-top: 1px solid ${$BORDER_COLOR};
        border-bottom: 1px solid ${$BORDER_COLOR};
      }
    }

    ${MoreBtn} {
      top: 10px;
      right: -5px;
      
      @media screen and (max-width: 680px) {
        right: 10px;
      }
    }
  }

  &.open {
    border-bottom: 0;

    h2 {
      margin-right: 30px;
      text-overflow: initial;
      white-space: initial;

      .guide-label {
        margin-top: -5px;
      }
    }

    .comment-area {
      @media screen and (max-width: 680px) {
        border-bottom: 0;
      }
    }
  }

  .fold-icon-btn {
    position: absolute;
    right: 14px;
    top: 11px;

    img {
      width: 19px;
      height: 9px;
    }
  }

  .fold-btn {
    position: relative;
    box-sizing: border-box;

    img {
      vertical-align: middle;
      width: 14px;
      height: 7px;
      margin: -3px 0 0 1px;
    }

    @media screen and (max-width: 680px) {
      border-top: 1px solid #eee;
      border-bottom: 1px solid ${$BORDER_COLOR};
    }
  }

  .title-box {
    position: relative;
  }
`;

export const InfoLi = styled.li<
  {userName?: IStory['user']['name']}
>`
  padding-right: 4px;
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  color: ${$TEXT_GRAY};

  ${props => props.userName && `
    margin: 0;
  `}

  .avatar {
    ${fontStyleMixin({
      size: 12,
      color: $GRAY
    })};
  }
`;

export const UserFollowInfo = styled.li`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  
  div {
    ${heightMixin(20)};
    padding-right: 5px;
    ${fontStyleMixin({
      size: 10,
      weight: '600'
    })};
    border-radius: 10px;
    box-sizing: border-box;

    img {
      width: 6px;
      height: 6px;
      vertical-align: middle;
      margin: -2px 3px 0 4px;
    }
  
    &.follow-cancel {
      color: #aeaeae;
      border: 1px solid #eee;
      background-color: #eee;
    }

    &.follow-add {
      color: ${$POINT_BLUE};
      border: 1px solid rgba(43, 137, 255, 0.3);

      img {
        width: 8px;
        margin: -2px 2px 0 3px;
      }
    }
  }
`;

export const StyledButton = styled(Button)`
  display: block;
  margin: 20px auto 50px;
`;

export const DictUl = styled.ul`
  margin: 0 30px;

  @media screen and (max-width: 680px) {
    margin: 0 15px;
  }
`;

export const InnerHTMLDiv = styled.div`
  padding: 20px 14px;
  font-size: 15px;
  
  img {
    display: block;
  }
`;

export const ShowDetailContentByBodyType = React.memo<any>(({bodyType, data, highlightKeyword}: {
  bodyType: Dig<IStory, 'body_type'>,
  data: string,
  highlightKeyword: string
}) => {
  if (!!data) {
    try {
      if (bodyType === 'atlas') {
        return (
          <HaniRenderer body={data}/>
        );
      } else if (bodyType === 'html' || bodyType === 'froala') {
        return (
          <InnerHTMLDiv className="fr-element fr-view" dangerouslySetInnerHTML={{__html: data}} />
        );
      } else if (bodyType === 'plain') {
        return (
          <p>{data}</p>
        );
      }
    } catch (e) {
      return (
        <p style={{
          color: '#ea6060',
          fontSize: '20px',
          textAlign: 'center',
        }}
        >
          에러가 발생했습니다.
        </p>
      );
    }
  }

  return null;
});

interface CountSpanProps {
  on: boolean;
  underline?: boolean;
}

export const CountSpan = styled.span<CountSpanProps>`
  color: ${({on}) => on ? `${$POINT_BLUE}!important` : $GRAY};
  text-decoration: ${({underline}) => underline ? 'underline' : 'none'};;
`;

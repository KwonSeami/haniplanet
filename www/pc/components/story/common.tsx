import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $GRAY, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import {inlineBlockMixin, maxLineEllipsisMixin, heightMixin, fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import Button from '../inputs/Button';
import * as React from 'react';
import Loading from '../common/Loading';
import HaniRenderer from '../editor/HaniRenderer';
import {IStory} from '../../src/@types/story';
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
`;

export const MoreBtn = styled.button`
  position: absolute;
  right: 0;
  top: 10px;
  z-index: 1;
  cursor: pointer;

  img {
    width: 27px;
  }
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
  right: -1px;
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
    cursor: pointer;

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

export const FeedFoldBtn = styled(Button)`
  position: absolute;
  top: 0.5px;
  right: 0;
  bottom: 0.5px;
  width: 40px;
  background-color: #f9f9f9;

  img {
    width: 14px;
    height: 7px;
  }
`;

export const StoryLabelP = styled.p`
  margin-bottom: 3px;
  ${fontStyleMixin({
    size: 12,
    color: $TEXT_GRAY
  })};
`;

export const FeedTitle = styled.div<Pick<IStory, 'user'>>`
  position: relative;
  padding: 15px 0 16px;
  box-sizing: border-box;

  ${StoryLabelP} {
    margin-top: -3px;
  }

  .title {
    display: inline-flex;
    max-width: 100%;
    height: 100%;
    align-items: center;

    h2 {
      line-height: 21px;
      ${fontStyleMixin({
        size: 16,
        weight: '600'
      })};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      &:hover {
        text-decoration: underline;
      }
      
      @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
        max-height: 41px;
      }
      
      span {
        display: inline-block;
        vertical-align: middle;
        margin: -3px 6px 0 0;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY
        })};
      }
    }

    img {
      display: inline-block;
      vertical-align: middle;
      margin: -2px 0 0 2px;
      width: 19px;
    }
  }

  .label-exist {
    .guide-label {
      margin-left: 4px;
      color: ${$FONT_COLOR};
      white-space: nowrap;
    }
  }

  .attrs {
    font-size: 0;
  }

  .contents {
    div ~ p {
      padding-top: 6px;
      color: ${$GRAY};
      ${maxLineEllipsisMixin(14, 1.5, 2)};
    }

    .tag li {
      p {
        padding: 0;
        margin: 4px 8px 0 0;
      }
    }
  }
`;

export const DetailFeedTitle = styled.div<Pick<IStory, 'user'>>`
  position: relative;
  padding: 18px 0 22px 22px;

  ${MoreBtn} {
    top: 17px;
    right: 15px;
  }

  h2 {
    margin-right: 57px;
    line-height: 26px;
    font-size:  18px;

    .guide-label {
      margin: -5px 4px 0 0;
      color: ${$FONT_COLOR};
    }
  }

  .info-box {
    position: relative;
    margin-top: 12px;
    padding-left: 44px;

    .attrs {
      margin-bottom: 2px;

      .onclass-owner-icon {
        width: 18px;
        margin-right: 2px;
        vertical-align: text-top;
      }

      .avatar {
        display: inline-block;

        .cropped-image {
          position: absolute;
          top: 0;
          left: -3px;
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
`;

export const StyledTitleCard = styled(TitleCard)`
  margin-bottom: 24px;
  border-top: 1px solid ${$GRAY};
  border-left: 1px solid ${$BORDER_COLOR};
  border-right: 1px solid ${$BORDER_COLOR};

  .file {
    padding: 10px 15px 0;
    margin-bottom: -13px;
  }
  
  ul.tag {
    padding: 20px;
  }

  .action-box {
    position: relative;
    border-top: 1px solid ${$GRAY};
    border-bottom: 1px solid ${$BORDER_COLOR};

    .reaction {
      cursor: default;

      > ul {
        margin: 15px 20px 17px;

      }
      .comment-area {
        border: 0;
        border-top: 1px solid ${$BORDER_COLOR};
      }
    }
  }

  .hani-renderer {
    padding: 20px 30px 10px;
  }

  .hash-target {
    position: relative;
    top: -120px;
  }

  .no-select ~ .embed-urlcard {
    margin-top: 20px;
  }
`;

export const InfoLi = styled.li<
  {userName?: IStory['user']['name']}
>`
  padding-right: 3px;
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  color: ${$TEXT_GRAY};

  ${props => props.userName && `
    margin: 0;
  `}

  .avatar {
    margin: 0;
    ${fontStyleMixin({
      size: 13,
      weight: 'normal'
    })}
  }
`;

export const UserFollowInfo = styled.li`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;

  div {
    ${heightMixin(20)}
    padding-right: 5px;
    ${fontStyleMixin({
      size: 10,
      weight: '600',
    })}
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
  padding: 0 20px;
  & > li:first-child {
    margin-top: 10px;
  }
`;

export const InnerHTMLDiv = styled.div`
  padding: 20px 30px;
  font-size: 15px;
`;

export const ShowDetailContentByBodyType = React.memo(({bodyType, data}: {
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
          <InnerHTMLDiv className="fr-element fr-view" dangerouslySetInnerHTML={{__html: data}}/>
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

interface CountNameProps {
  on: boolean;
  underline?: boolean;
}

export const CountName = styled.p<CountNameProps>`
  &, span {
    color: ${({on}) => on ? `${$POINT_BLUE}!important` : $GRAY};
  }

  span {
    text-decoration: ${({underline}) => underline ? 'underline' : 'none'};;
  }
`;

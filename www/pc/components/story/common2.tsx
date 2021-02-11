import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $GRAY, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import {inlineBlockMixin, maxLineEllipsisMixin, heightMixin, fontStyleMixin} from '../../styles/mixins.styles';
import Button from '../inputs/Button';
import * as React from 'react';
import Loading from '../common/Loading';
import HaniRenderer from '../editor/HaniRenderer';
import {IStory} from '../../src/@types/story';

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
  right: 0;
  top: 14px;
  z-index: 1;
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

export const FeedTitle = styled.div<Pick<IStory, 'user'>>`
  position: relative;
  padding: 15px 0 16px;
  
  .guide-label {
    margin: -6px 0 9px;
  }

  & > h2 {
    padding-right: 40px;

    &, a {
      ${maxLineEllipsisMixin(16, 1.3, 2)};
      font-weight: bold;
    }

    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      max-height: 41px;
    }
  }
  
  .attrs {
    position: relative;
    width: 100%;
  }

  .user-label-wrapper {
    position: absolute;
    right: 7px;
    top: 0;
    padding-top: 0;

    .label {
      margin-left: 2px;
    }
  }

  ul {
    padding-top: 5px;

    &.user-label {
      padding: 11px 0 0;

      li {
        display: inline-block;
        vertical-align: middle;
        padding-left: 4px;
      }
    }

    ${props => props.user && `
      padding: 9px 6px 0 0;
    `}
  }
`;

export const InfoLi = styled.li<
  {userName: IStory['user']['name']}
>`
  position: relative;
  margin-top: 2px;
  padding-right: 4px;
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  color: ${$TEXT_GRAY};

  ${props => props.userName && `
    margin: 0;
  `}

  &:first-child {
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: $FONT_COLOR
    })}
  }
`;

export const UserFollowInfo = styled.li`
  cursor: pointer;
  position: relative;
  margin-top: 2px;
  padding-right: 4px;
  display: inline-block;
  vertical-align: middle;
  ${fontStyleMixin({
    size: 13,
    weight: '500',
  })}

  div {
    display:inline;

    &.follow-add {
      color: ${$POINT_BLUE};
    }
  
    &.follow-cancel {
      color: ${$GRAY};
    }

    img {
      width: 15px;
      height: 15px;
      vertical-align: middle;
      margin-top: -3px;
    }
  }

  &:hover {
    text-decoration: underline;
  }

`;

export const StyledButton = styled(Button)`
  display: block;
  margin: 20px auto 50px;
`;

export const DictUl = styled.ul`
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

  return <Loading/>;
});

interface CountSpanProps {
  on: boolean;
  underline?: boolean;
}

export const CountSpan = styled.span<CountSpanProps>`
  color: ${({on}) => on ? `${$POINT_BLUE}!important` : $FONT_COLOR};
  text-decoration: ${({underline}) => underline ? 'underline' : 'none'};;
`;

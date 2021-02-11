import React from 'react';
import styled from 'styled-components';
import {ICommunityComment} from '../../../src/reducers/community';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY, $BORDER_COLOR, $FONT_COLOR} from '../../../styles/variables.types';
import Link from 'next/link';

const Div = styled.div`
  position: relative;
  padding: 10px 0 9px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;

  @media screen and (max-width: 680px) {
    padding: 10px 15px;
  }

  h3, p {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
  }

  h3 {
    padding-left: 30px;
    line-height: 21px;
    ${fontStyleMixin({
      size: 14,
      color: $FONT_COLOR
    })};

    &::before {
      content: '댓글';
      position: absolute;
      top: 50%;
      left: 0;
      padding: 3px 4px;
      transform: translateY(-50%);
      line-height: 1;
      ${fontStyleMixin({
        size: 10,
        color: '#999'
      })};
      border-radius: 4px;
      background-color: #f2f3f7;
    }
  }
  
  p {
    margin-top: 1px;
    padding-left: 15px;
    line-height: 18px;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })}

    &::before {
      content: '';
      position: absolute;
      left: 3px;
      top: 2px;
      width: 6px;
      height: 7px;
      border-left: 2px solid ${$BORDER_COLOR};
      border-bottom: 2px solid ${$BORDER_COLOR};
    }
  }
`;

const LatestCommentItem = ({
  text,
  story: {
    title,
    id: storyId
  }
}: ICommunityComment) => {
  return (
    <Div>
      <Link
        href="/community/[id]"
        as={`/community/${storyId}`}
      >
        <a>
          <h3>{title}</h3>
          <p>{text}</p>
        </a>
      </Link>
    </Div>  
  );
};

export default React.memo(LatestCommentItem);


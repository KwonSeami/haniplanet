import React from 'react';
import styled from 'styled-components';
import {ICommunityComment} from '../../../src/reducers/community';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY, $BORDER_COLOR} from '../../../styles/variables.types';
import Link from 'next/link';

const Div = styled.div`
  position: relative;
  padding: 10px 0 9px;
  box-sizing: border-box;

  & ~ & {
    border-top: 1px solid #eee;
  }

  h4, p {
    position: relative;
  }

  p {
    padding-left: 30px;
    font-size: 13px;
    line-height: 19px;

    &::before {
      content: '댓글';
      position: absolute;
      top: 2px;
      left: 0;
      padding: 3px 4px;
      line-height: 1;
      ${fontStyleMixin({
        size: 10,
        color: '#999'
      })}
      border-radius: 4px;
      background-color: #f2f3f7;
    }
  }

  h4 {
    margin-top: 3px;
    padding-left: 13px;
    line-height: 18px;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })}

    &::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 2px;
      width: 6px;
      height: 6px;
      border-left: 2px solid ${$BORDER_COLOR};
      border-bottom: 2px solid ${$BORDER_COLOR};
    }
  }

  &:hover {
    h4,p {
      text-decoration: underline;
    }
  }
`;

const LatestCommentItem = ({
  text,
  story: {
    title,
    id
  }
}: ICommunityComment) => {
  return (
    <Div>
      <Link
        href="/community/[id]"
        as={`/community/${id}`}
      >
        <a>
          <p className="ellipsis">{text}</p>
          <h4 className="ellipsis">{title}</h4>
        </a>
      </Link>
    </Div>  
  );
};

export default React.memo(LatestCommentItem);

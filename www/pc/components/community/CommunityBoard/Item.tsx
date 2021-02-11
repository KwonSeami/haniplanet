import React from 'react';
import styled from 'styled-components';
import {ICommunityStory} from '../../../src/reducers/community';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../styles/variables.types';
import {under} from '../../../src/lib/numbers';
import Link from 'next/link';

const Div = styled.div`
  padding: 6px 0;
  line-height: 19px;
  box-sizing: border-box;

  a {
    display: flex;
    max-width: 100%;
    white-space: nowrap;
    align-content: flex-end;
  }
  .category {
    padding-right: 4px;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })};
  }

  h3 {
    padding-right: 4px;
    font-size: 13px;
    line-height: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      text-decoration: underline;
    }
  }

  .blue {
    ${fontStyleMixin({
      size: 11,
      color: '#499aff'
    })};
  }
`;

interface Props extends ICommunityStory {
}

const CommunityBoardItem = ({
  id,
  title,
  comment_count,
  menu_tag
}: Props) => {
  return (
    <Div>
      <Link
        as={`/community/${id}`}
        href="/community/[id]"
      >
        <a>
          {menu_tag.name && (
            <span className="category">[{menu_tag.name}]</span>
          )}
          <h3>{title}</h3>
          {comment_count > 0 && (
            <span className="blue">({under(comment_count, 99)})</span>
          )}
        </a>
      </Link>
    </Div>  
  );
};

export default React.memo(CommunityBoardItem);

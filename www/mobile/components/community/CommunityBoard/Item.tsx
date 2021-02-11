import React from 'react';
import styled from 'styled-components';
import {ICommunityStory} from '../../../src/reducers/community';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY, $FONT_COLOR} from '../../../styles/variables.types';
import {under} from '../../../src/lib/numbers';
import Link from 'next/link';

const Div = styled.div`
  height: 40px;
  font-size: 0;
  border-bottom: 1px solid #eee;

  @media screen and (max-width: 680px) {
    padding: 0 15px;
  }

  a {
    display: flex;
    max-width: 100%;
    height: 100%;
    white-space: nowrap;
    align-items: center;
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
    line-height: inherit;
    white-space: nowrap;
    text-overflow: ellipsis;
    ${fontStyleMixin({
      size: 14,
      color: $FONT_COLOR
    })};
    overflow: hidden;
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

const LatestStoryItem = ({
  id,
  title,
  comment_count,
  menu_tag = {id: '', name: ''}
}: Props) => {
  const {
    name: tagName
  } = menu_tag;
  
  return (
    <Div>
      <Link
        as={`/community/${id}`}
        href="/community/[id]"
      >
        <a>
          {!!tagName && (
            <span className="category">[{tagName}]</span>
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

export default React.memo(LatestStoryItem);

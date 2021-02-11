import React from 'react';
import styled from 'styled-components';
import {ICommunityCategory} from '../../../src/reducers/community';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE, $GRAY} from '../../../styles/variables.types';
import Link from 'next/link';

const Li = styled.li`
  padding: 4px 14px 3px;

  a {
    display: flex;
    width: 100%;
    align-items: center;
    align-content: center;
  }

  em {
    font-style: normal;
    width: 16px;
    height: 16px;
    line-height: 16px;
    margin: 1px 8px 0 0;
    text-align: center;
    ${fontStyleMixin({
      size: 10,
      weight: '600',
      color: $GRAY,
      family: 'Montserrat'
    })};
    border: 1px solid #eee;
  }

  h4 {
    width: 120px;
    height: 23px;
    line-height: 24px;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }

  p {
    flex: 1;
    text-align: right;
    ${fontStyleMixin({
      size: 12,
      weight: '600',
      color: '#999',
    })};

    span {
      color: ${$POINT_BLUE};
      
      span {
        font-family: 'Montserrat';
      }
    }
  }

  &:hover {
    h4 {
      text-decoration: underline;
    }
  }
`;

interface Props extends ICommunityCategory {
  idx: number;
}

const Item = ({
  id,
  name,
  idx,
  story_count
}: Props) => {
  return (
    <Li key={id}>
      <Link 
        href={`/community?category=${id}`}
        as={`/community?category=${id}`}
        scroll={false}
        passHref={true}
      >
        <a>
          <em>{idx + 1}</em>
          <h4>{name}</h4>
          <p>
            <span><span>{story_count}</span>개</span>
            의 새 글
          </p>
        </a>
      </Link>
    </Li>
  );
};

export default React.memo(Item);

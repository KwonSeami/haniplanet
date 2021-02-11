import * as React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY, $WHITE, $POINT_BLUE} from '../../../styles/variables.types';
import {useSelector} from 'react-redux';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {shallowEqual} from 'recompose';
import {ICommunityStory} from '../../../src/reducers/community';
import {RootState} from '../../../src/reducers';
import Link from 'next/link';
import {timeSince} from '../../../src/lib/date';

const Li = styled.li`
  position: relative;
  float: left;
  width: 50%;
  height: 91px;
  padding: 15px 20px 14px 35px;
  background-color: ${$WHITE};
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.2s;

  &:hover {
    background-color: #f6f7f9;
  }

  em {
    position: absolute;
    top: 15px;
    left: 17px;
    font-style: normal;
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: '#c6dfff',
      family: 'Montserrat'
    })};
  }

  span {
    display: block;
    margin: 0 4px 3px 0;
    font-size: 12px;
    color: ${$POINT_BLUE};
  }

  h4 {
    font-size: 15px;
    letter-spacing: -0.4px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  ul {
    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin: 3px 5px 0 6px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}

      &:first-child {
        margin-left: 0;
      }

      & ~ li::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -6px;
        width: 2px;
        height: 2px;
        transform: translateY(-50%);
        background-color: #ccc;
      }
    }
  }
`;

interface Props extends ICommunityStory {
  idx: number;
}

const Item: React.FC<Props> = ({
  id,
  idx,
  menu_tag, 
  title, 
  created_at, 
  retrieve_count, 
  up_count, 
  comment_count
}) => {

  return (
    <Li>
      <Link
        href="/community/[id]"
        as={`/community/${id}`}
      >
        <a>
          <em>{idx + 1}</em>
          {menu_tag.name && (
            <span>[{menu_tag.name}]</span>
          )}
          <h4>{title}</h4>
          <ul>
            <li>{timeSince(created_at)}</li>
            <li>조회 {retrieve_count}</li>
            <li>좋아요 {up_count}</li>
            <li>댓글 {comment_count}</li>
          </ul>
        </a>
      </Link>
    </Li>
  )
};

Item.displayName = 'Item';

export default React.memo(Item);

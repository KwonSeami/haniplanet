import * as React from 'react';
import styled from 'styled-components';
import {heightMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $GRAY, $POINT_BLUE } from '../../../styles/variables.types';
import Link from 'next/link';
import {HashId} from '../../../../../packages/types';


const Li = styled.li`
  padding: 7px 0 8px;
  line-height: 23px;
  border-bottom: 1px solid #eee;

  & a > * {
    display: inline-block; 
    vertical-align: middle;
    box-sizing: border-box;
  }

  i {
    width: 17px;
    ${heightMixin(17)};
    margin-right: 8px;
    text-align: center;
    ${fontStyleMixin({
      size: 10,
      weight: '600',
      color: $GRAY,
      family: 'Montserrat'
    })};
    border: 1px solid #eee;
  }

  p {
    ${fontStyleMixin({
      size: 14,
      color: $FONT_COLOR
    })};
  }

  span {
    float: right;
    ${fontStyleMixin({
      size: 12,
      color: '#999'
    })};

    em {
      color: ${$POINT_BLUE}
    }
  }
`;

interface Props {
  id: HashId;
  name: string;
  story_count: number;
  ranking: number;
}

const BestCategoryItem:React.FC<Props> = ({
  id,
  name,
  story_count,
  ranking
}) => (
  <Li>
    <Link
      href={`/community?category=${id}`}
      as={`/community?category=${id}`}
    >
      <a>
        <i>{ranking}</i>
        <p>{name}</p>
        <span>
          <em>{story_count}개</em>의 새글
        </span>
      </a>
    </Link>
  </Li>
);

BestCategoryItem.displayName = 'BestCategoryItem';
export default React.memo(BestCategoryItem); 
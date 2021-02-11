import * as React from 'react';
import styled, {StyleSheetManager} from 'styled-components';
import {
  $TEXT_GRAY, 
  $POINT_BLUE
} from '../../../../styles/variables.types';
import {fontStyleMixin, heightMixin, backgroundImgMixin} from '../../../../styles/mixins.styles';
import {staticUrl} from '../../../../src/constants/env';
import Link from 'next/link';

interface Props {
  rankItem: string;
  rankIndex: number;
}

const StyledLink = styled.a`
  display: block;
  position: relative;
  padding: 0 20px 0 35px;
  ${heightMixin(43)}
  ${fontStyleMixin({
    size: 13, 
    weight: '600'
  })};
  box-sizing: border-box;
  cursor: pointer;
  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  span {
    position: absolute;
    left: 15px;
    top: 0;
    ${fontStyleMixin({
      weight: '600',
      color: $TEXT_GRAY,
      family: 'Montserrat'
    })}
  }

  &:hover {
    ${fontStyleMixin({
      weight: 'bold',
      color: $POINT_BLUE
    })}
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png'),
      size: '12px 13px',
      position: '96% 50%'
    })}

    span {
      ${fontStyleMixin({
        weight: 'bold',
        color: $POINT_BLUE
      })}
    }
  }
`;

const SearchRankItem: React.FC<Props> = React.memo(
  ({rankItem, rankIndex}) => {
    return (
      <Link href={`/search?q=${rankItem}`}>
        <StyledLink>
          <span>{rankIndex}</span>
          {rankItem}
        </StyledLink>
      </Link>

    );
  }
);

export default SearchRankItem;

import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE} from '../../../styles/variables.types';
import Link from 'next/link';

const Div = styled.div`
  display: inline-block;
  width: 50%;
  ${heightMixin(46)};
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  vertical-align: top;

  &:nth-child(2n+1) {
    border-right: 1px solid #eee;
  }

  &:nth-last-child(-n+2) {
    border-bottom: 0;
  }

  a {
    ${fontStyleMixin({
      size: 15,
      color: $POINT_BLUE
    })};

    span {
      margin-right: 9px;
      opacity: 0.5;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        family: 'Montserrat',
        color: '#c6dfff'
      })};
    }
  }
`;

interface Props {
  keyword: string;
  rank: number;
}

const SearchRankItem: React.FC<Props> = ({keyword, rank,}) => {
  const _rank = rank < 10
    ? `0${rank}`
    : rank;

  return (
    <Div className="ellipsis">
      <Link href={`/search?q=${keyword}`}>
        <a>
          <span>{_rank}</span>
          {keyword}
        </a>
      </Link>
    </Div>
  );
};

export default React.memo(SearchRankItem);

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface Props {
  className?: string;
  keyword: string;
  rank: number;
  maxLength: number;
  isShowRankOrder?: boolean;
}

const Li = styled.li`
  &:hover p {
    text-decoration: underline;
  }
`;

const SearchRankItem: React.FC<Props> = ({
  className,
  keyword,
  rank,
  maxLength,
  isShowRankOrder
}) => {
  const keywordText = keyword.length <= maxLength
    ? keyword
    : `${keyword.substr(0, maxLength)}...`;

  return (
    <Li className={className}>
      <Link href={`/search?q=${keyword}`}>
        <a>
          <p>
            {isShowRankOrder && (<span>{rank}</span>)}
            {keywordText}
          </p>
        </a>
      </Link>
    </Li>
  );
};

export default React.memo(SearchRankItem);

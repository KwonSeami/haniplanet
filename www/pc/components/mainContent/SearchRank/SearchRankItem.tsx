import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import Link from 'next/link';

const PreviewLi = styled.li`
  display: inline-block;

  ~ li {
    margin-left: 10px;
  }

  a {
    display: inline-block;
    ${fontStyleMixin({
      size: 12,
    })};
  }

  &:hover {
    text-decoration: underline;
  }
`;

const Li = styled.li`
  width: 270px;
  box-sizing: border-box;

  ~ li {
    padding-top: 8px;
  }

  &:nth-child(6) {
    padding-top: 0;
  }

  &:nth-child(n+6) {
    padding-left: 14px;
    border-left: 1px solid #eee;
  }

  &:last-child span {
    margin-left: -3px;
  }

  p {
    position: relative;
    padding-left: 18px;
    ${fontStyleMixin({
      size: 13,
    })};

    &:hover {
      text-decoration: underline;
    }

    span {
      position: absolute;
      top: 3px;
      left: 0;
      ${fontStyleMixin({
        size: 13,
        weight: '800',
        family: 'Montserrat',
        color: '#499aff'
      })};
    }
  }
`;

const MAX_PREVIEW_KEYWORD_LENGTH = 7;
const MAX_KEYWORD_LENGTH = 19;

interface Props {
  keyword: string;
  rank: number;
}

export const PreviewSearchRankItem: React.FC<Props> = ({keyword}) => {
  const keywordText = keyword.length <= MAX_PREVIEW_KEYWORD_LENGTH
    ? keyword
    : `${keyword.substr(0, MAX_PREVIEW_KEYWORD_LENGTH)}...`;

  return (
    <PreviewLi>
      <Link href={`/search?q=${keyword}`}>
        <a>
          {keywordText}
        </a>
      </Link>
    </PreviewLi>
  );
};

const SearchRankItem: React.FC<Props> = ({keyword, rank}) => {
  const keywordText = keyword.length <= MAX_KEYWORD_LENGTH
    ? keyword
    : `${keyword.substr(0, MAX_KEYWORD_LENGTH)}...`;

  return (
    <Li>
      <Link href={`/search?q=${keyword}`}>  
        <a>
          <p>
            <span>{rank}</span>
            {keywordText}
          </p>
        </a>
      </Link>
    </Li>
  );
};

SearchRankItem.displayName = 'SearchRankItem';

export default React.memo(SearchRankItem);

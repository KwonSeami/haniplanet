import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$GRAY} from '../../styles/variables.types';
import {useRouter} from 'next/router';
import Link from 'next/link';

const Section = styled.section`
  & ~ section {
    margin-top: 30px;
  }

  > h4 {
    position: relative;
    line-height: 23px;
    padding-bottom: 15px;
    border-bottom: 1px solid ${$GRAY};
    ${fontStyleMixin({
      size: 16,
      weight: 'bold'
    })};
  }

  .contents {
    overflow: hidden;
  }

  .more {
    text-align: right;
    margin-top: 9px;

    span {
      text-decoration: underline;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        color: $GRAY
      })}
    }

    img {
      vertical-align: middle;
      width: 11px;
      margin: -4px 0 0 4px;
    }
  }
`;

interface Props {
  title: string;
  children: React.ReactNode;
  tabName: string;
}

const SearchSection: React.FC<Props> = ({title, children, tabName}) => {
  const router = useRouter();
  const {query: {q: query}} = router;
  
  return (
    <Section>
      <h4>{title}</h4>
      <div className="contents">
        {children}
      </div>
      <div className="more">
        <Link href={
          title === '마켓'
            ? `/shopping?q=${query}&page=1`
            : `/search?q=${query}&tab=${tabName}`
        }>
          <a>
            <span>{title} 더보기</span>
            <img
              src={staticUrl('/static/images/icon/arrow/icon-search-more.png')}
              alt="더보기"
            />
          </a>
        </Link>
      </div>
    </Section>
  )
};

SearchSection.displayName = 'SearchSection';
export default React.memo(SearchSection);
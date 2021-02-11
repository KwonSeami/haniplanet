import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../styles/variables.types';
import {useRouter} from 'next/router';
import Link from 'next/link';

const Section = styled.section`

  > h4 {
    position: relative;
    line-height: 23px;
    padding: 15px 0;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 16,
      weight: 'bold'
    })};

    @media screen and (max-width: 680px) {
      padding: 15px;
    }
  }

  .contents {
    overflow: hidden;
  }

  .more {
    text-align: center;
    padding: 15px 0;
    border-top: 1px solid ${$BORDER_COLOR};
    border-bottom: 8px solid #ecedef;

    span {
      text-decoration: underline;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        color: $TEXT_GRAY
      })}
    }

    img {
      vertical-align: middle;
      width: 11px;
      margin: -1px 0 0 1px;
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
      <div className="content">
        {children}
      </div>
      <div className="more">
        <Link href={`/search?q=${query}&tab=${tabName}`}>
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
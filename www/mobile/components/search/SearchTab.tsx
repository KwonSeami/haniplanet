import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import Link from 'next/link';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$FONT_COLOR} from '../../styles/variables.types';
import {useRouter} from 'next/router';

const TabDiv = styled.div`
  position: relative;
  max-width: 680px; 
  margin: 0 auto;
  overflow: hidden;
  z-index: 1;

  ul {
    text-align: left;
    padding: 14px 0;
    border-bottom: 1px solid #eee;
    overflow-x: auto;
    white-space: nowrap;

    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;

      & ~ li {
        margin-left: 15px;
      }

      a {
        display: block;
        line-height: 20px;
        ${fontStyleMixin({
          size: 16,
          weight: '300',
          color: '#999'
        })}
      }

      &.on {
        &:before {
          content: '';
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 11px;
          background-color: #edf5ff;
          z-index: -1;
        }

        a {
          ${fontStyleMixin({
            color: $FONT_COLOR,
            weight: '600'
          })}
        }
      }
    } 
  }

  @media screen and (max-width: 680px) {
    ul {
      padding: 14px 15px;
    }
  }
`;

const SEARCH_TAB_LIST = [
  {
    name: '',
    text: '통합검색'
  },
  {
    name: 'feed',
    text: '피드'
  },
  {
    name: 'moa',
    text: 'MOA',
  },
  {
    name: 'hospital',
    text: '한의원'
  },
  {
    name: 'meetup',
    text: '세미나/모임'
  },
  {
    name: 'dict',
    text: '처방사전'
  },
  {
    name: 'user',
    text: '회원'
  }
];

const SearchTab:React.FC = () => {
  const router = useRouter();
  const {query: {q: query, tab = ''}} = router;
  const currTab = (
    SEARCH_TAB_LIST.filter(({name}) => tab === name)[0] 
    || SEARCH_TAB_LIST[0]
  ).name;

  return (
    <TabDiv>
      <ul>
        {SEARCH_TAB_LIST.map(({
          text,
          name
        }) => (
          <li className={cn({on: currTab === name})}>
            <Link href={`/search?q=${query}&tab=${name}`}>
              <a>{text}</a>
            </Link>
          </li>
        ))}
      </ul>
    </TabDiv>
  )
}

SearchTab.displayName = 'SearchTab';

export default React.memo(SearchTab);
import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $WHITE, $TEXT_GRAY} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
import Loading from '../common/Loading';
import {SearchTopWrapperDiv, SearchContentDiv, SearchTitle, StyledPagination} from './index';
import {useQuery} from '@apollo/react-hooks';
import {WIKIS} from '../../src/gqls/wiki';
import SearchTab from './SearchTab';
import {numberWithCommas} from '../../src/lib/numbers';
import {ISearchProps} from '../../src/@types/search';
import SearchNoContentText from './SearchNoContent';

export const DictListUl = styled.ul`
  li a {
    display: block;
    position: relative;
    width: 100%;
    padding: 10px 0 9px;
    background-color: ${$WHITE};
    border-bottom: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    @media screen and (max-width: 680px) {
      padding: 10px 15px 9px;
    }

    h3, p, & > span {
      width: 100%;
      padding-right: 55px;
      box-sizing: border-box;
    }

     h3 {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
      span {
        
      font-weight: 600;
      }
    }

     & > span {
      display: block;
      padding: 3px 35px 3px 0;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY,
      })};
    }

     p {
      ${fontStyleMixin({
        size: 12,
        color: '#67aef6',
        weight: '600'
      })};
    }
  }
`;

const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 10;


const _SearchDictItem: React.FC<IMedicine> = ({
  code,
  other_name,
  chn_name,
  tags,
  name,
}) => (
  <Link href={`/wiki/${code}`}>
    <a>
      <p className="ellipsis">{other_name}</p>
      <h3 className="ellipsis">
        {name}
        <span> {chn_name}</span>
      </h3>
      <span className="ellipsis">{tags.map(({name}) => name).join(', ')}</span>
    </a>
  </Link>
);

export const SearchDictItem = React.memo(_SearchDictItem);

const WIKIS_RESPONSE_DEFAULT_FEILD = {
  wikis: {
    nodes: [],
    total_count: 0,
  }
}

const SearchDictMobile: React.FC<ISearchProps> = ({
  query,
  page,
  setURL
}) => {
  const currPage = Number(page) || 1;
  const {
    loading,
    data: {wikis: {
      nodes: wikis, total_count
    }} = WIKIS_RESPONSE_DEFAULT_FEILD
  } = useQuery(WIKIS, {
    variables: {
      q: query, 
      offset: (currPage-1) * PAGE_SIZE,
      limit: PAGE_SIZE
    }
  });

  return (
    <SearchContentDiv>
      <SearchTopWrapperDiv>
        <SearchTab/>
        <div className="count">
          <p>
            <span>{numberWithCommas(total_count)}건</span>
            의 검색결과
          </p>
        </div>
      </SearchTopWrapperDiv>
      {loading ? (
        <Loading/>
      ) : !isEmpty(wikis) ? (
        <div>
          <SearchTitle>처방사전</SearchTitle>
          <DictListUl>
            {wikis.map(({code, ...rest}) => (
              <li key={code}>
                <SearchDictItem
                  code={code}
                  {...rest}
                />
              </li>
            ))}
            </DictListUl>
          <StyledPagination
            className="pagination"
            currentPage={currPage}
            pageSize={PAGE_SIZE}
            totalCount={total_count}
            pageGroupSize={PAGE_GROUP_SIZE}
            onClick={page => {
              setURL(param => ({
                ...param,
                page
              }))
            }}
          />
        </div>
      ) : (
        <SearchNoContentText/>
      )}
    </SearchContentDiv>
  );
};

SearchDictMobile.displayName = 'SearchDictMobile';

export default React.memo(SearchDictMobile);

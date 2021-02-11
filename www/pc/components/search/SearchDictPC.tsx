import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $WHITE, $TEXT_GRAY, $POINT_BLUE} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import AdditionalContent from '../layout/AdditionalContent';
import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
import Loading from '../common/Loading';
import {FeedContentDiv, LeftFeed, FeedTitle, StyledPagination} from './styleCompPC';
import SearchRank from './SearchRank';
import {numberWithCommas} from '../../src/lib/numbers';
import {useQuery, useApolloClient} from '@apollo/react-hooks';
import {WIKIS} from '../../src/gqls/wiki';
import gql from 'graphql-tag';
import {ISearchProps} from '../../src/@types/search';
import KeyWordHighlight from '../common/KeyWordHighlight';
import SearchNoContentText from './SearchNoContent';

const DictListUl = styled.ul`

  li {
    &:first-child a {
      border-top: 1px solid ${$BORDER_COLOR};
    }

    a {
      display: block;
      position: relative;
      width: 100%;
      padding: 10px 0 9px;
      background-color: ${$WHITE};
      border-bottom: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;

      h3, p, & > span {
        width: 100%;
        padding-right: 35px;
        box-sizing: border-box;
        font-weight: bold;
      }

      h3 {
        ${fontStyleMixin({
          size: 15,
          weight: '600'
        })};
        line-height: 1.5;
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
          color: $POINT_BLUE,
        })};
      }
    }
  }
`;


const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 10;
const RANK_WIKIS_QUERY = gql`
  query Wikis ($offset: Int, $limit: Int, $order_by: IOrderByEnum) {
    wikis (offset: $offset, limit: $limit, order_by: $order_by) {
      nodes {
        name
      }
    }
  }
`
const WIKIS_RESPONSE_DEFAULT_FEILD = {
  wikis: {
    nodes: [],
    total_count: 0,
  }
}

export interface ISearchDictItemProps {
  code: string;
  other_name: string;
  chn_name: string;
  tags?: ITag[];
  name: string;
  className?: string;
  highlightKeyword?: string;
};

const _SearchDictItem: React.FC<ISearchDictItemProps> = ({
  code,
  other_name,
  chn_name,
  tags,
  name,
  className,
  highlightKeyword
}) => (
  <Link href={`/wiki/${code}`}>
    <a className={className}>
      <p className="ellipsis">{other_name}</p>
      <h3 className="ellipsis">
        {highlightKeyword ? (
          <KeyWordHighlight
            text={name}
            keyword={highlightKeyword}
            color={$POINT_BLUE}
          />
        ) : name}
        <span>{chn_name}</span>
      </h3>
      <span className="ellipsis">{tags.map(({name}) => name).join(', ')}</span>
    </a>
  </Link>
);

export const SearchDictItem = React.memo(_SearchDictItem);

const SearchDictPC: React.FC<ISearchProps> = ({
  query,
  page,
  setURL,
}) => {
  const client = useApolloClient();
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
    <FeedContentDiv className="clearfix">
      <LeftFeed>
        {loading ? (
          <Loading/>
        ) : !isEmpty(wikis) ? (
          <>
            <FeedTitle>
              처방사전
              <p className="list-conut">
                <span>{`${numberWithCommas(total_count)}건`}</span>
                의 검색결과
              </p>
            </FeedTitle>            
            <DictListUl>
              {wikis.map(({code, ...rest}) => (
                <li key={code}>
                  <SearchDictItem
                    code={code}
                    highlightKeyword={query}
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
          </>
        ) : (
          <SearchNoContentText/>
        )}
      </LeftFeed>
      <AdditionalContent>
        <SearchRank
          title="처방사전 인기 검색어"
          api={() => {
            return new Promise((resolve) => {              
              client
                .query({
                  query: RANK_WIKIS_QUERY,
                  variables: {
                    limit: 10,
                    offset: 1,
                    order_by: 'view_count_desc'
                  }
                })
                .then(({
                  data: {wikis: {nodes}} = WIKIS_RESPONSE_DEFAULT_FEILD
                }) => {
                  const result = {
                    data: nodes.map(({name}) => ({
                      keyword: name
                    }))
                  };
                  resolve(result);
                });
              })
          }}
        />
      </AdditionalContent>
    </FeedContentDiv>
  );
};

SearchDictPC.displayName = 'SearchDictPC';

export default React.memo(SearchDictPC);
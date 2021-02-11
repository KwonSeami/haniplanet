import * as React from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import {useRouter} from 'next/router';
import {useQuery} from '@apollo/react-hooks';
import {WIKIS} from '../../src/gqls/wiki';
import WikiItem from '../../_pages/wiki/WikiItem';
import WikiSearchForm from '../../_pages/wiki/input/WikiSearchForm';
import SearchInput from '../../_pages/wiki/input/SearchInput';
import OGMetaHead from '../../components/OGMetaHead';
import Page500 from '../../components/errors/Page500';
import Loading from '../../components/common/Loading';
import {staticUrl} from '../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $TEXT_GRAY, $WHITE, $GRAY, $FLASH_WHITE} from '../../styles/variables.types';
import {setLayout, clearLayout} from '../../src/reducers/system/style/styleReducer';
import Pagination from '../../components/UI/Pagination';

interface SearchParamProps {
  q?: string;
  page?: string;
  order_by?: string;
  is_detail?: boolean | string;
  category?: string;
  shapes?: string;
  include_dependencies?: string;
  exclude_dependencies?: string;
  include_tags?: string;
  exclude_tags?: string;
  max_dependency_count?: number;
  min_dependency_count?: number;
  max_price?: number;
  min_price?: number;
  doc_type?: string;
  _only?: string;
}

const PageWrapperSection = styled.section`
  width: 100%;
  box-sizing: border-box;
  background-color: #f6f7f9;
`;

const WikisWrapperDiv = styled.div`
  overflow: hidden;

  @media screen and (min-width: 900px) {
    width: 900px;
    margin: 0 auto;
  }

  > h2 {
    padding: 14px 15px 4px;
    ${fontStyleMixin({
      size: 21,
      weight: '600',
    })}

    @media screen and (min-width: 900px) {
      padding: 14px 0 4px;
    }
  }

  div {
    position: relative;
  }

  select {
    height: 30px; 
    padding-right: 20px;
    font-size: 14px;
    text-align-last: right;
    appearance: none;
    border: 0;
    background-color: transparent;
    box-sizing: border-box;
    ${backgroundImgMixin({
      img: '/static/images/icon/check/icon-select.png',
      size: '19px',
      position: '100% 50%'
    })};
    outline: none;

    &::-ms-expand {
      display: none;
    }
  }

  .content {
    margin-top: 8px;
    background-color: ${$WHITE};

    & > div {
      position: relative;
      padding: 16px 15px;
      border-bottom: 2px solid ${$FONT_COLOR};

      span {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translate(0, -50%);
      }
    }

    h2 {
      ${fontStyleMixin({
        size: 16,
        weight: 'bold'
      })};
      line-height: 1;
    }
  }

  .pagination {
    max-width: 900px;
    padding: 30px 0;

    @media screen and (max-width: 900px) {
      margin-top: 0;
    }
  }
`;

const ViewTypeDiv = styled.div`
  display: flex;
  padding: 12px 10px 12px 15px;
  font-size: 0;

  @media screen and (min-width: 900px) {
    padding: 12px 0;
  }
  
  & > div ~ div {
    flex: 1;  
    text-align: right;
  }

  button {
    display:inline-block;
    width: 50px;
    height: 30px;
    text-align: center;
    border: 1px solid ${$BORDER_COLOR};
    background-color: ${$WHITE};
    
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: $FONT_COLOR
    })};

    &.on {
      border-width: 0;
      background-color: ${$POINT_BLUE};
      color: ${$WHITE};
    }

    & ~ button {
      margin-left: 4px;
    }
  }
`;

const DefaultUl = styled.ul`
  & > li {
    position: relative;
    width: 100%;
    background-color: ${$WHITE};
    border-bottom: 1px solid #e4e6ed;
    box-sizing: border-box;

    & > div {
      position: relative;
      padding: 10px 55px 10px 15px;

      &.element {
        padding: 20px;
        background-color: ${$FLASH_WHITE};
        border-left: 1px solid #e4e6ed;
        border-right: 1px solid #e4e6ed;

        p {
          position: relative;
          padding-left: 10px;
          font-size: 12px;
          line-height: 1.5;
          /* white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis; */
          
          span {
            font-size: inherit;
            line-height: inherit
          }

          &::before {
            position: absolute;
            left:0;
            top: 9px;
            width: 4px;
            height: 1px;
            background-color: ${$GRAY};
            content: '';
          }

          & ~ p {
            margin-top: 10px;
          }
        }

        em {
          padding-right: 5px;
          font-style: normal;
          font-weight: bold;

          &::before {
            content: '[';
          }
          &::after {
            content : ']';
          }
        }
      }
    }

    p {
      font-size: 13px;
      line-height: 1.3;
    }

    h3 {
      width: 100%;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold'
      })};
      line-height: 1.5;
    }
    
    i {
      width: 100%;
      font-style: normal;
      ${fontStyleMixin({
        size: 12,
        color: $POINT_BLUE,
        weight: 'bold'
      })};
      box-sizing: border-box;
    }

    .others {
      position: relative;
      min-height: 18px;
      line-height: 18px;
    }

    .tags {
      width: 100%;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 0,
        color: $TEXT_GRAY,
      })};

      li {
        display: inline;
        ${fontStyleMixin({
          size: 12,
          color: '#999'
        })}

        & ~ li {
          &:before {
            content: ', '
          }
        }
      }
    }

    .more {
      position: absolute;
      right: -20px;
      top:0;
      ${fontStyleMixin({
        size: 12,
        color: $GRAY
      })}
      line-height: inherit;
      text-decoration: underline;
    }
    
    .bookmark {
      position: absolute;
      right: 22px;
      top: 11px;

      img {
        width: 17px;
      }
    }
  }
`;

const SearchBtn = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  width: 96px;
  height: 40px;
  background-color: #b3c4ce;
  font-size: 13px;
  color: ${$WHITE};

  span {
    display: inline-block;
    position: relative;
    margin: 0 0 -2px 8px;
    padding: 0;
    width: 0;
    height: 0;
    border: 4px solid transparent;
    border-top-color: #fff;

    &::after {
      display: block;
      content: "";
      position: absolute;
      top: 0;
      width: 0;
      height: 0;
      left: -8px;
      margin-top: -10px;
      border: 8px solid transparent;
      border-top-color: #b3c4ce;
    }
  }

  &.on {
    span {
      transform-origin: 50% 25%;
      transform: rotate(180deg);
    }
  }
`;

const StyledSearchInput = styled(SearchInput)`
  background-color: ${$WHITE};
  padding-right: 96px;

  &.full {
    padding: 0;
  }

  &.open {
    border: 2px solid ${$POINT_BLUE};
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  .search-input-box {
    padding-right: 0;
  }
`;

const NoContentP = styled.p`
  padding: 50px 0;
  text-align: center;
  font-size: 14px;
`;

const PAGE_SIZE = 10;

const Wiki = React.memo(() => {
  const access = useSelector(
    ({system: {session: {access}}}) => access,
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const {query} = router;
  const {
    q: _q,
    page,
    order_by = 'view_count_desc',
    is_detail = false,
    shapes = '',
    include_dependencies = '',
    exclude_dependencies = '',
    include_tags = '',
    exclude_tags = '',
    max_dependency_count,
    min_dependency_count,
    max_price,
    min_price,
    doc_type,
    _only: only = ''
  }:SearchParamProps = query;

  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: '처방사전'
    }));
    
    return () => {
      dispatch(clearLayout());
    }
  }, []);

  const setURL = ((callback:Function) => {
    const searchParams:SearchParamProps = callback(query);
    router.push(`/wiki?${queryString.stringify(searchParams)}`);
  });

  const [search, setSearch] = React.useState(_q);
  const [isDetail, setIsDetail] = React.useState(is_detail === 'true');
  const [orderBy] = React.useState(order_by);
  const {error, loading, data: {wikis} = {}, updateQuery} = useQuery(WIKIS, {
    variables: {
      shapes: !isEmpty(shapes) ? shapes.split(',') : [],
      include_dependencies: !isEmpty(include_dependencies) ? include_dependencies.split(',') : [],
      exclude_dependencies: !isEmpty(exclude_dependencies) ? exclude_dependencies.split(',') : [],
      include_tags: !isEmpty(include_tags) ? include_tags.split(',') : [],
      exclude_tags: !isEmpty(exclude_tags) ? exclude_tags.split(',') : [],
      max_dependency_count,
      min_dependency_count,
      max_price,
      min_price,
      limit: PAGE_SIZE,
      offset: (parseInt(page) - 1) * PAGE_SIZE,
      q: _q,
      doc_type: doc_type,
      order_by: orderBy,
      only: only || null,
      isBookmarkedArticle: !isEmpty(only)
    }
  });

  if (error) return <Page500/>;
  if (loading) return <Loading/>;
  
  const {
    nodes = [],
    total_count = 0
  } = wikis;

  const title = `${total_count}개의 처방사전 목록`;
  
  return (
    <>
      <OGMetaHead title={title} />
      <PageWrapperSection>
        <WikisWrapperDiv>
          <h2>처방사전</h2>
          <ViewTypeDiv>
              <div>
                <button 
                  type="button"
                  className={classNames({
                    on: !doc_type
                  })}
                  onClick={() => {
                    setURL(curr => {
                      delete curr.doc_type;
                      return {
                        ...curr,
                        order_by: orderBy === 'dependency_count_desc' ? 'view_count_desc' : order_by,
                      }
                    })
                  }}
                >
                  전체
                </button>
                <button 
                  type="button"
                  className={classNames({
                    on: doc_type === 'medicine'
                  })}
                  onClick={() => {
                    setURL(curr => ({
                      ...curr,
                      doc_type: 'medicine'
                    }))
                  }}
                >
                  방제
                </button>
                <button 
                  type="button"
                  className={classNames({
                    on: doc_type === 'herb'
                  })}
                  onClick={() => {
                    setURL(curr => ({
                      ...curr,
                      order_by: orderBy === 'dependency_count_desc' ? 'view_count_desc' : order_by,
                      doc_type: 'herb'
                    }))
                  }}
                >
                  약재
                </button>
                <button
                  type="button"
                  className={classNames({
                    on: doc_type === 'topic'
                  })}
                  onClick={() => {
                    setURL(curr => ({
                      ...curr,
                      order_by: orderBy === 'dependency_count_desc' ? 'view_count_desc' : order_by,
                      doc_type: 'topic'
                    }))
                  }}
                >
                  토픽
                </button>
              </div>
              {access && (
                <div>
                <select
                  value={only}
                  onChange={({target: {value}}) => {
                    setURL(curr => ({
                      ...curr,
                      page: 1,
                      _only: value
                    }))
                  }}
                >
                  <option value="">전체보기</option>
                  <option value="bookmarked_wiki">북마크 보기(사전)</option>
                  <option value="bookmarked_block">북마크 보기(컨텐츠)</option>
                </select>
              </div>
              )}
            </ViewTypeDiv>
            <div className="search-wrapper">
              <StyledSearchInput
                className={classNames({
                  full: doc_type !== 'medicine'
                })}
                value={search}
                clearImg={staticUrl('/static/images/icon/icon-clear-btn.png')}
                searchOnImg={staticUrl('/static/images/icon/icon-search-on.png')}
                searchOffImg={staticUrl('/static/images/icon/icon-search-off.png')}
                onChange={(value) => setSearch(value)}
                onSubmit={() => {
                  setURL((curr) => ({
                    ...curr,
                    page: 1, 
                    q: search
                  }));
                }}
              />
              {doc_type === 'medicine' && (
                <SearchBtn
                  type="button"
                  className={classNames('btn-toggle', {
                    on: isDetail
                  })}
                  onClick={() => {
                    setIsDetail(curr => !curr);
                  }}
                >
                  상세검색<span/>
                </SearchBtn>
              )}
            </div>
            {(isDetail && doc_type === 'medicine') && (
              <WikiSearchForm
                clearImg={staticUrl('/static/images/icon/icon-clear-btn.png')}
                onDetailSearch={param => {
                  setURL(() => ({
                    ...param,
                    page: 1,
                    q: _q,
                    order_by: orderBy,
                    doc_type: doc_type,
                    is_detail: isDetail
                  }));
                }}
              />
            )}
            <div className="content">
              <div className="header">
                <h2>{title}</h2>
                <span>
                  <select
                    value={orderBy}
                    onChange={(e) => {
                      const {target: {value}} = e;
                      setURL(param => ({
                        ...param,
                        page: 1,
                        order_by: value,
                        is_detail: isDetail
                      }))
                    }}
                  >
                    <option value="view_count_desc">조회순</option>
                    <option value="name_asc">가나다순</option>
                    {doc_type === 'medicine' && (
                      <option value="dependency_count_desc">약재 많은순</option>
                    )}
                  </select>
                </span>
              </div>
              {!isEmpty(nodes) ? (
                <DefaultUl>
                  {nodes.map(({code, ...wiki}) => (
                    <WikiItem
                      key={code}
                      code={code}
                      access={access}
                      updateQuery={updateQuery}
                      {...wiki}
                    />
                  ))}
                </DefaultUl>
              ) : (
                <NoContentP>
                  {search && '검색'} 결과가 없습니다.
                </NoContentP>
              )}
            </div>
            {!!total_count && (
              <Pagination
                totalCount={parseInt(total_count) || 0}
                currentPage={parseInt(page) || 1}
                pageSize={PAGE_SIZE}
                pageGroupSize={5}
                onClick={page => {
                  setURL(param => ({
                    ...param,
                    page,
                    is_detail: isDetail 
                  }))
                }}
              />
            )}
        </WikisWrapperDiv>
      </PageWrapperSection>
    </>
  )
})

export default Wiki;

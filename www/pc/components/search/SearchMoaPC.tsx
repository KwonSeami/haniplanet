import * as React from 'react';
import styled from 'styled-components';
import {
  $BORDER_COLOR,
  $WHITE,
  $TEXT_GRAY,
  $FONT_COLOR,
  $THIN_GRAY,
  $GRAY,
  $POINT_BLUE
} from '../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import Link from 'next/link';
import {staticUrl} from '../../src/constants/env';
import AdditionalContent from '../layout/AdditionalContent';
import isEmpty from 'lodash/isEmpty';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';
import Loading from '../common/Loading';
import useIntegratedSearch from './useIntegratedSearch';
import {FeedContentDiv, LeftFeed, FeedTitle, StyledPagination} from './styleCompPC';
import {numberWithCommas} from '../../src/lib/numbers';
import SearchRank from './SearchRank';
import SearchApi from '../../src/apis/SearchApi';
import KeyWordHighlight from '../common/KeyWordHighlight';
import {ISearchProps} from '../../src/@types/search';
import {TIntegratedSearchMoa} from '../../src/@types/band';
import SearchNoContentText from './SearchNoContent';

export const MoaListUl = styled.ul`
  margin: 0 -5px;

  & > li {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 220px;
    height: 238px;
    margin: 0 5px 15px;
    padding-bottom: 9px;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
    
    ul {
      padding: 0 10px;

      li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        padding: 5px 4px 5px 0;
        margin-right: 8px;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY
        })}

        span {
          color: ${$FONT_COLOR};
        }

        & ~ li::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -7px;
          width: 2px;
          height: 2px;
          transform: translateY(-50%);
          border-radius: 50%;
          background-color: ${$THIN_GRAY};
        }
      }
    }

    a {
      p {
        display: -webkit-box;
        margin-bottom: 8px;
        padding: 0 10px;
        line-height: 19px;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        ${fontStyleMixin({
          size: 13,
          color: $GRAY
        })};
      }
    }
  }
`;

// @진혜연: props 전달을 위해 Banner는 스타일드 컴포넌트로 분리합니다.
const Banner = styled.div<{img?: string;}>`
  ${({img}) => img && backgroundImgMixin({img: img || ''})};
  width: 100%;
  height: 138px;
  position: relative;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: rgba(102, 102, 102, 0.6);
    mix-blend-mode: multiply;
  }

  & > img {
    width: 63px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -30px 0 0 -28px;
  }

  h3 {
    position: relative;
    width: 100%;
    padding: 15px;
    ${fontStyleMixin({
      size: 15,
      color: $WHITE
    })}
    z-index: 2;
    box-sizing: border-box;
  }

  .shortcuts {
    position: absolute;
    display: none;
    right: 16px;
    bottom: 19px;
    ${fontStyleMixin({
      size: 12,
      color: $WHITE,
      weight: 'bold'
    })}
    z-index: 2;
    box-sizing: border-box;
 
    img {
      width: 58px;
      display: block;
    }
  }
`;

const MoaDiv = styled.div`

  &:hover {
    ${Banner}::after {
      background-color: rgba(102, 102, 102, 0.8);
    }

    .shortcuts {
      display: block;
    }
  }
`;

const PAGE_SIZE = 15;
const PAGE_GROUP_SIZE = 10;

const _SearchMoaItem: React.FC<TIntegratedSearchMoa> = ({
  avatar,
  name,
  new_story_count,
  slug,
  story_count,
  band_member_grade,
  body,
  highlightKeyword
}) => (
  <MoaDiv>
    <Link href={`/band/${slug}`}>
      <a>
        <Banner img={avatar}>
          <h3>{name}</h3>
          <img
            src={staticUrl('/static/images/icon/icon-moa-content-default.png')}
            alt={`${name} 모아`}
          />
          <span className="shortcuts">
            바로가기
            <img
              src={staticUrl('/static/images/icon/arrow/icon-shortcuts-white.png')}
              alt={`${name} 바로가기`}
            />
          </span>
        </Banner>
        <ul>
          <li>
            총 게시물 <span>{story_count}</span>
          </li>
          <li>
            {ADMIN_PERMISSION_GRADE.includes(band_member_grade) ? '회원수' : '새 글'}&nbsp;
            <span>{new_story_count}</span>
          </li>
        </ul>      
        <p>
          {highlightKeyword ? (
            <KeyWordHighlight
              text={body}
              keyword={highlightKeyword}
              color={$POINT_BLUE}
            />
          ) : body}
        </p>
      </a>
    </Link>
  </MoaDiv>
);

export const SearchMoaItem = React.memo(_SearchMoaItem);

const SearchMoaPC: React.FC<ISearchProps> = ({
  query,
  page,
  setURL
}) => {
  const {
    bandList,
    bandRest,
    getBands
  } = useIntegratedSearch<TSearchBand>(query);
  const currPage = Number(page) || 1;
  const [bandType] = React.useState('["moa", "consultant"]');
  const {pending, count} = bandRest;

  React.useEffect(() => {
    getBands({
      bandType,
      offset: (currPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE
    });
  }, [query, bandType, page]);

  return (
    <FeedContentDiv className="clearfix">
      <LeftFeed>
        {pending ? (
          <Loading/>
        ) : !isEmpty(bandList) ? (
          <>
            <FeedTitle>
              MOA
              <p className="list-conut">
                <span>{`${numberWithCommas(count || 0)}건`}</span>
                의 검색결과
              </p>
            </FeedTitle>
            <MoaListUl>
              {bandList.map(({slug, ...rest}) => (
                <li key={slug}>
                  <SearchMoaItem
                    highlightKeyword={query}
                    slug={slug}
                    {...rest}
                  />
                </li>
              ))}
            </MoaListUl>    
            <StyledPagination
              className="pagination"
              currentPage={currPage}
              pageSize={PAGE_SIZE}
              totalCount={count}
              pageGroupSize={PAGE_GROUP_SIZE}
              onClick={page => {
                if(currPage !== page) {
                  setURL(param => ({
                    ...param,
                    page
                  }))
                }
              }}
            />
          </>
        ) : (
          <SearchNoContentText/>
        )}
      </LeftFeed>
      <AdditionalContent>
        <SearchRank
          title="인기 검색어"
          api={() => new SearchApi().rank()}
        />
      </AdditionalContent>
    </FeedContentDiv>
  );
};

SearchMoaPC.displayName = 'SearchMoaPC';

export default React.memo(SearchMoaPC);

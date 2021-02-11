import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $WHITE, $TEXT_GRAY, $FONT_COLOR, $THIN_GRAY, $GRAY} from '../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin, maxLineEllipsisMixin} from '../../styles/mixins.styles';
import Link from 'next/link';
import {staticUrl} from '../../src/constants/env';
import {SearchTopWrapperDiv, SearchContentDiv, SearchTitle, StyledPagination} from './index';
import Loading from '../common/Loading';
import isEmpty from 'lodash/isEmpty';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';
import useIntegratedSearch from './useIntegratedSearch';
import SearchTab from './SearchTab';
import {numberWithCommas} from '../../src/lib/numbers';
import {ISearchProps} from '../../src/@types/search';
import SearchNoContentText from './SearchNoContent';

export const MoaListDiv = styled.div`
  overflow: hidden;

  > ul {
    margin: 0 -5px -15px;

    @media screen and (max-width: 680px) {
      padding: 0 10px;
      margin: 0 0 -15px;
    }

    & > li {
      display: inline-block;
      vertical-align: middle;
      position: relative;
      width: 162px;
      height: 220px;
      margin: 15px 5px;
      box-sizing: border-box;
      border-bottom: 1px solid ${$BORDER_COLOR};
      
      @media screen and (max-width: 680px) {
        width: 160px;
      }

      h3 {
        width: 100%;
        ${maxLineEllipsisMixin(14, 1.3, 2)};
        font-weight: 600;
      }

      ul {
        li {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          padding-right: 3px;
          margin-right: 5px;
          ${fontStyleMixin({
            size: 11,
            color: $TEXT_GRAY
          })}

          span {
            color: ${$FONT_COLOR};
          }

          &::after {
            content: '';
            width: 2px;
            height: 2px;
            border-radius: 50%;
            background-color: ${$THIN_GRAY};
            position: absolute;
            right: -3px;
            top: 50%;
            margin-top: -1px;
          }

          &:last-child::after {
            display: none;
          }
        }
      }

      a {
        p {
          display: -webkit-box;
          margin-top: 10px;
          line-height: 17px;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          ${fontStyleMixin({
            size: 12,
            color: $GRAY
          })};
        }
      }
    }
  }
`;

const Badge = styled.span`
  position: absolute;
  bottom: 24px;
  left: 53px;
  display: block;
  width: 52px;
  height: 52px;
  ${fontStyleMixin({
    size: 10,
    color: $WHITE,
    weight: 'bold'
  })}
`;

// @진혜연: props 전달을 위해 Banner는 스타일드 컴포넌트로 분리합니다.
const Banner = styled.div<{img?: string;}>`
  ${({img}) => img && backgroundImgMixin({img: img || ''})};
  width: 100%;
  height: 105px;
  box-sizing: border-box;
  position: relative;
  border: 1px solid ${$BORDER_COLOR};
  margin-bottom: 5px;

  & > img {
    width: 52px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -25px 0 0 -26px;
  }
`;

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 10;

const _SearchMoaItem: React.FC<TIntegratedSearchMoa> = ({
  avatar,
  category,
  name,
  new_story_count,
  slug,
  story_count,
  band_member_grade,
  body,
}) => (
  <Link href={`/band/${slug}`}>
    <a>
      <Banner img={avatar}>
        <img
          src={staticUrl('/static/images/icon/icon-moa-content-default.png')}
          alt={`${name} 모아`}
        />
        {category.avatar_on  && (
          <Badge>
            <img
              src={category.avatar_on}
              alt={`${category.name} 모아`}
            />
          </Badge>
        )}
      </Banner>
      <h3>{name}</h3>
      <ul>
        <li>
          총 게시물 <span>{story_count}</span>
        </li>
        <li>
          {ADMIN_PERMISSION_GRADE.includes(band_member_grade) ? '회원수' : '새 글'}&nbsp;
          <span>{new_story_count}</span>
        </li>
      </ul>
      <p>{body}</p>
    </a>
  </Link>
);

export const SearchMoaItem = React.memo(_SearchMoaItem);

const SearchMoaMobile: React.FC<ISearchProps> = ({
  query,
  page,
  setURL
}) => {
  const {
    bandList,
    bandRest,
    getBands
  } = useIntegratedSearch<TSearchMoa>(query);

  const currPage = Number(page) || 1;
  const [bandType] = React.useState('["moa", "consultant"]');
  const {pending, count} = bandRest;

  React.useEffect(() => {
    getBands({
      bandType,
      page: currPage,
      limit: PAGE_SIZE
    });
  }, [getBands, bandType, currPage]);


  return (
    <SearchContentDiv>
      <SearchTopWrapperDiv>
        <SearchTab/>
        <div className="count">
          <p>
            <span>{numberWithCommas(count)}건</span>
            의 검색결과
          </p>
        </div>
      </SearchTopWrapperDiv>
      {pending ? (
        <Loading/>
      ) : !isEmpty(bandList) ? (
        <div>
          <SearchTitle>MOA</SearchTitle>
          <MoaListDiv>
            <ul>
              {bandList.map(({slug, ...rest}) => (
                <li key={slug}>
                  <SearchMoaItem
                    slug={slug}
                    {...rest}
                  />
                </li>
              ))}
            </ul>
          </MoaListDiv>    

          <StyledPagination
            className="pagination"
            currentPage={currPage}
            pageSize={PAGE_SIZE}
            totalCount={count}
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

SearchMoaMobile.displayName = 'SearchMoaMobile';

export default React.memo(SearchMoaMobile);

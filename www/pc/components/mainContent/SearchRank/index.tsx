import React from 'react';
import styled from "styled-components";
import {fontStyleMixin} from '../../../styles/mixins.styles';
import useSaveApiResult from '../../../src/hooks/useSaveApiResult';
import SearchApi from '../../../src/apis/SearchApi';
import {ISearchRank} from '../../../src/@types/search';
import {staticUrl} from '../../../src/constants/env';
import Button from '../../inputs/Button';
import {$BORDER_COLOR, $WHITE} from '../../../styles/variables.types';
import cn from 'classnames';
import {toDateFormat} from '../../../src/lib/date';
import useInterval from '../../../src/hooks/useInterval'
import SearchRankItem from './SearchRankItem';

const Div = styled.div`
  position: relative;
  width: 600px;
  margin-top: 5px;
  box-sizing: border-box;

  .hot-keywords-title {
    display: inline-block;

    h3 {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
      })};
    }

    .button {
      margin: 1px 0 0 5px;
      vertical-align: middle;

      img {
        width: 10px;
        margin-top: 3px;
        vertical-align: top;
      }
    }
  }

  .preview-rank-wrapper {
    position: relative;
    display: inline-block;
    width: 520px;
    height: 20px;
    vertical-align: middle;
    overflow: hidden;

    ul {
      position: absolute;
      top: 1px;
      left: 14px;
      transform: translateY(-40px);
  
      &.show {
        transform: translateY(0);
      }
    }
  }

  .open-rank-box {
    position: absolute;
    z-index: 1;
    top: 2px;
    left: 0;
    width: 600px;
    height: 192px;
    padding: 12px 0 0 17px;
    background-color: ${$WHITE};
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
    display: none;

    h3 {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold',
      })};

      span {
        margin: 1px 0 0 5px;
        vertical-align: top;
        display: inline-block;
        ${fontStyleMixin({
          size: 11,
          color: '#999',
        })};
      }
    }

    .rank-close-btn {
      position: absolute;
      top: 7px;
      right: 7px;
      width: 30px;
    }

    ul {
      height: 137px;
      padding: 13px 20px 0 2px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }

    &.toggle {
      display: block;
    }
  }
`;

const PreviewStyledSearchRankItem = styled(SearchRankItem)`
  display: inline-block;

  ~ li {
    margin-left: 10px;
  }

  p {
    display: inline-block;
    ${fontStyleMixin({
      size: 12,
    })};
  }
`;

const StyledSearchRankItem = styled(SearchRankItem)`
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

const MAX_RANK_SHOW_COUNTS = 5;

const MAX_PREVIEW_KEYWORD_LENGTH = 7;
const MAX_KEYWORD_LENGTH = 19;

const BASE_DATE = toDateFormat(new Date(), 'YY.MM.DD');

interface Props {
  ranks?: ISearchRank[];
}

const SearchRank: React.FC<Props> = ({ranks: defaultRanks}) => {
  const {resData: ranks = []} = defaultRanks
    ? {resData: defaultRanks}
    : useSaveApiResult(() => new SearchApi().rank());

  const [isOpen, setIsOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const openRankToggle = React.useCallback(() => {
    setIsOpen(curr => !curr)
  },[]);
  const changeShowState = React.useCallback(() => {
    setShow(curr => !curr);
  }, []);

  const {
    start: searchRankCarouselStart,
    stop: searchRankCarouselStop,
  } = useInterval({
    callback: changeShowState,
    duration: 5000,
  });

  return (
    <Div className="clearfix">
      <div className="hot-keywords-title">
        <h3>
          인기 검색어
        </h3>
        <Button
          size={{ 
            width: '17px',
            height: '17px',
          }}
          border={{
            width: '1px',
            radius: '4px',
            color: $BORDER_COLOR,
          }}
          onClick={openRankToggle}
        >
          <img
            src={staticUrl('/static/images/icon/arrow/icon-btn-down.png')}
            alt="펼치기"
          />
        </Button>
      </div>
      <div
        className="preview-rank-wrapper"
        onMouseEnter={() => {
          searchRankCarouselStop();
        }}
        onMouseLeave={() => searchRankCarouselStart()}
      >
        <ul className={cn({show})}>
          {ranks.slice(0, MAX_RANK_SHOW_COUNTS).map(({keyword}, index) => (
            <PreviewStyledSearchRankItem
              key={`search-rank-${keyword}-${index}`}
              keyword={keyword}
              rank={index + 1}
              maxLength={MAX_PREVIEW_KEYWORD_LENGTH}
            />
          ))}
        </ul>
        <ul className={cn({show: !show})}>
          {ranks.slice(MAX_RANK_SHOW_COUNTS, MAX_RANK_SHOW_COUNTS + 5).map(({keyword}, index) => (
            <PreviewStyledSearchRankItem
              key={`search-rank-${keyword}-${index}`}
              keyword={keyword}
              rank={index + 1}
              maxLength={MAX_PREVIEW_KEYWORD_LENGTH}
            />
          ))}
        </ul>
      </div>
      <div className={cn('open-rank-box', {toggle: isOpen})}>
        <h3>
          인기 검색어
          <span>{BASE_DATE} 기준</span>
        </h3>
        <img
          className="pointer rank-close-btn"
          src={staticUrl('/static/images/icon/icon-close.png')}
          alt="닫기"
          onClick={openRankToggle}
        />
        <ul>
          {ranks.map(({keyword}, index) => (
            <StyledSearchRankItem
              key={`search-rank-${keyword}-${index}`}
              keyword={keyword}
              rank={index + 1}
              maxLength={MAX_KEYWORD_LENGTH}
              isShowRankOrder
            />
          ))}
        </ul>
      </div>
    </Div>
  );
};

SearchRank.displayName = 'SearchRank';

export default React.memo(SearchRank);

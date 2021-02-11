import React from 'react';
import styled from "styled-components";
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../styles/variables.types';
import Button from '../../inputs/Button';
import cn from 'classnames';
import {ISearchRank} from '../../../src/@types/search';
import useSaveApiResult from '../../../src/hooks/useSaveApiResult';
import SearchApi from '../../../src/apis/SearchApi';
import {toDateFormat} from '../../../src/lib/date';
import SearchRankItem from './SearchRankItem';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import range from 'lodash/range';

const Div = styled.div`
  padding-top: 41px;
  border-bottom: 1px solid #eee;

  .search-rank-title {
    max-width: 680px;
    margin: 0 auto 13px;
    padding: 0 15px;

    h3 {
      ${fontStyleMixin({
        size: 15,
        weight: '600',
      })};

      button {
        margin-left: 5px;

        img {
          width: 11px;
          margin-top: -5px;
          vertical-align: middle;
          transform: rotate(90deg);
        }

        &.toggle {
          background-color: #f9f9f9;

          img {
            margin-top: -5px;
            vertical-align: middle;
            transform: rotate(270deg);
          }
        }
      }

      span {
        padding-top: 3px;
        float: right;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 10,
          color: $TEXT_GRAY,
        })};
      }
    }
  }

  .search-rank-container {
    max-width: 680px;
    margin: 0 auto;
    border-top: 1px solid #eee;
  }

  .slick-active {
    z-index: 1;
  }

  @media screen and (min-width: 680px) {
    .search-rank-title {
      padding: 0;
    }

    .search-rank-container {
      &.is-open {
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
      }
    }
  }
`;
 
const BASE_DATE = toDateFormat(new Date(), 'YY.MM.DD');

const rankSliderSettings = {
  autoplay: true,
  slidesToShow: 1,
  draggable: false,
  swipe: false,
  arrows: false,
  infinite: true,
  fade: true,
  speed: 300,
};

const RANK_COUNT_PER_SLIDE = 2;

interface Props {
  ranks?: ISearchRank[];
}

const SearchRank: React.FC<Props> = ({ranks: defaultRanks}) => {
  const {resData: ranks} = defaultRanks
    ? {resData: defaultRanks}
    : useSaveApiResult(() => new SearchApi().rank());

  const [isOpen, setIsOpen] = React.useState(false);

  const openRankToggle = React.useCallback(() => {
    setIsOpen(curr => !curr)
  },[]);

  return (
    <Div className="clearfix">
      <div className="search-rank-title">
        <h3>
          인기 검색어
          <Button
            size={{
              width: '20px',
              height: '20px'
            }}
            border={{
              width: '1px',
              radius: '0',
              color: '#eee'
            }}
            onClick={openRankToggle}
            className={cn({toggle: isOpen})}
          >
            <img
              src={staticUrl('/static/images/icon/arrow/icon-shortcut.png')}
              alt={isOpen ? '접기' : '펼치기'}
            />
          </Button>
          <span>{BASE_DATE} 기준</span>
        </h3>
      </div>
      <div className={cn('search-rank-container', {'is-open': isOpen})}>
        {isOpen ? (
          (ranks || []).map(({keyword}, order) => (
            <SearchRankItem
              key={`search-rank-${keyword}-${order}`}
              keyword={keyword}
              rank={order + 1}
            />
          ))
        ) : (
          <ReactCustomSlick
            {...rankSliderSettings}
          >
          {range(0, Math.ceil(ranks.length / RANK_COUNT_PER_SLIDE)).map(index => {
            const start = index * RANK_COUNT_PER_SLIDE;
            const end = (start + RANK_COUNT_PER_SLIDE) > ranks.length
              ? ranks.length
              : start + RANK_COUNT_PER_SLIDE;

            return (
              <div key={index}>
                {range(start, end).map((order) => (
                  <SearchRankItem
                    key={`search-rank-${ranks[order].keyword}-${order}`}
                    keyword={ranks[order].keyword}
                    rank={order + 1}
                  />
                ))}
              </div>
              )
            })}
          </ReactCustomSlick>
        )}
      </div>
    </Div>
  );
};

export default React.memo(SearchRank);

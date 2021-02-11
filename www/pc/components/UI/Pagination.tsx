import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$FONT_COLOR, $TEXT_GRAY, $BORDER_COLOR, $WHITE} from '../../styles/variables.types';
import range from 'lodash/range';

interface Props {
  className?: string;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  pageGroupSize?: number;
  onClick: (page: number) => void;
}

const Div = styled.div`
  text-align: center;

  button {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin: 0 2px;
    text-align: center;
    border: 1px solid ${$BORDER_COLOR};
    background-color: ${$WHITE};
    cursor: pointer;

    &:hover {
      background-color: #f9f9f9;
    }
  }

  ul {
    margin: 0 28px;
    display: inline-block;

    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        color: $TEXT_GRAY,
        family: 'Montserrat'        
      })};

      & ~ li {
        margin-left: 15px;
      }

      &.on {
        color: ${$FONT_COLOR};

        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          border-bottom: 1px solid ${$FONT_COLOR};
        }
      }
    }
  }
`;

const paginationContentButton = (img: string, alt: string) => (
  <img
    src={staticUrl(`/static/images/icon/arrow/${img}.png`)}
    alt={alt}
  />
);

const getStartEnd = (current: number, maximum: number, groupSize = 10) => {
  const base = Math.floor(current / groupSize);
  const min = current % groupSize === 0 ? current - groupSize + 1 : base * groupSize + 1;
  const _max = current % groupSize === 0 ? current : base * groupSize + groupSize;
  const max = _max > maximum ? maximum : _max;

  return [min, max];
};

const Pagination: React.FC<Props> = React.memo(({
  className,
  currentPage,
  totalCount,
  pageSize,
  pageGroupSize,
  onClick,
}) => {
  const firstPage = 1;
  const lastPage = Math.floor(totalCount / pageSize) + (totalCount % pageSize ? 1 : 0);
  const [start, end] = getStartEnd(currentPage, lastPage, pageGroupSize);
  const prevGroup = start > 1 ? start - pageGroupSize : 1;
  const nextGroup = lastPage > end ? end + 1 : lastPage;

  return (
    <Div className={cn('pagination', className)}>
      {(currentPage > 1 && lastPage > pageGroupSize) && (
        <>
          <button
            onClick={() => onClick(firstPage)}
          >
            {paginationContentButton('icon-pagination-first', '처음으로')}
          </button>
          <button
            onClick={() => onClick(prevGroup)}
          >
            {paginationContentButton('icon-pagination-prev', '이전')}
          </button>
        </>
      )}
      <ul>
      {range(start, end + 1).map(page => (
        <li 
          key={page}
          className={cn({on: currentPage === page})}
          onClick={() => onClick(page)}
        >
          {page < 10 ? `0${page}`: page}
        </li>
      ))}
      </ul>
      {(currentPage < lastPage && lastPage > pageGroupSize) && (
        <>
          <button
            onClick={() => onClick(nextGroup)}
          >
            {paginationContentButton('icon-pagination-next', '다음')}
          </button>
          <button
            onClick={() => onClick(lastPage)}
          >
            {paginationContentButton('icon-pagination-last', '마지막으로')}
          </button>
        </>
      )}
    </Div>
  )
});

Pagination.displayName = 'Pagination';
export default Pagination;

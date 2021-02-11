import * as React from 'react';
import styled from 'styled-components';
import { fontStyleMixin } from '../../styles/mixins.styles';
import { $POINT_BLUE, $BORDER_COLOR, $TEXT_GRAY, $GRAY } from '../../styles/variables.types';
import cn from 'classnames';

interface ISortOrderMenuProps {
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  orders?: {value: string, label: string}[];
}

export const SortOrderMenuUl = styled.ul`
  li {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: $TEXT_GRAY
    })};
    
    & ~ li::before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px;
      width: 1px;
      height: 10px;
      border-left: 1px solid ${$BORDER_COLOR};
    }
    
    &.on {
      text-decoration: underline;
      color: ${$POINT_BLUE};
    }
      
    &:not(.on) {
      &:hover {
        color: ${$GRAY};
      }
    }
  }
`;

const DEFAULT_ORDERS = [
  {value: 'created_at', label: '과거순'},
  {value: '-created_at', label: '최신순'},
  {value: '-up_count', label: '인기순'}
];

const SortOrderMenu  = React.memo<ISortOrderMenuProps>((
  {
    sort,
    setSort,
    orders
  }
) => {
  return (
    <SortOrderMenuUl className="sort-order-menu">
      {
        (orders || DEFAULT_ORDERS).map(({value, label}) => (
          <li
            key={value}
            onClick={() => setSort(value)}
            className={cn({on : sort === value})}
          >
            {label}
          </li>
        ))
      }
    </SortOrderMenuUl>
  );
});

export default SortOrderMenu;

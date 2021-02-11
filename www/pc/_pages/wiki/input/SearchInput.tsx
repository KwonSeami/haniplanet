import * as React from 'react';
import styled from 'styled-components';
import {$WHITE, $POINT_BLUE, $FONT_COLOR} from '../../../styles/variables.types';
import cn from 'classnames';

const SearchInputDiv = styled.div`
  box-sizing: border-box;
  width: 100%;
  position: relative;

  .search-input-box {
    box-sizing: border-box;
    width: 100%;
    position: relative;
    background-color: ${$WHITE};
    padding-right: 70px;

    .text-field {
      display: block;
      width: 100%;
      height: 40px;
      min-height: 35px;
      padding: 0 10px;
      font-size: 15px;
      color:${$FONT_COLOR};
      border: 0 !important;
      border-radius: 0;
      outline: none;
      box-sizing:border-box;
      
      &:focus {
        border-color: ${$POINT_BLUE} !important;
      }
    }
  
    .input-clear, .search-icon {
      position: absolute;
    }
  
    .input-clear {
      position: absolute;
      right: 50px;
      top: 7px;
      padding: 5px;
    }
    
    .search-icon {
      top: 5px;
      right: 15px;
      width: 20px;
    }
  }
`;

export interface Props {
  value: string;
  clearImg: string;
  searchOnImg?: string;
  searchOffImg?: string;
  className?: string;
  hasSearchIcon?: boolean;
  placeholder?: string;
  autoCompleteList?: any[];
  onChange: (query: string) => void;
  onEnter?: (query: string | object) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  autoCompleteFn?: (row: number, value: string) => React.ReactNode;
}

const SearchInput = React.memo<Props>(({
  value,
  clearImg,
  searchOnImg,
  searchOffImg,
  autoCompleteList,
  className,
  hasSearchIcon,
  placeholder = '검색어를 입력해 주세요.',
  onChange,
  onSubmit,
  onEnter,
  autoCompleteFn,
}) => {
  const [focusedRow, setFocusedRow] = React.useState(0);
  const acList = autoCompleteFn ? autoCompleteFn(focusedRow, value) : autoCompleteList;

  return (
    <SearchInputDiv className={cn('search-input', className)}>
      <form
        action=""
        onSubmit={e => {
          e.preventDefault();
          onSubmit && onSubmit(e);
        }}
      >
        <div className="search-input-box">
          <input
            className="text-field"
            value={value}
            placeholder={placeholder}
            onChange={({target: {value}}) => {
              onChange && onChange(value);
              setFocusedRow(0);
            }}
            onKeyDown={e => {
              if (!!autoCompleteList) {
                if (e.keyCode === 13) {
                  // enter(return) key
                  const row = autoCompleteList[focusedRow];
                  onEnter 
                    ? onEnter(row)
                    : onChange(typeof row === 'string' ? row : (row as any).name);
                } else if (e.keyCode === 40) {
                  // down arrow key
                  setFocusedRow(curr => curr < autoCompleteList.length ? curr + 1 : 0);
                } else if (e.keyCode === 38) {
                  // up arrow key
                  setFocusedRow(curr => curr !== 0 ? curr - 1 : autoCompleteList.length - 1);
                }
              }
            }}
          />
          {value && !!value.length && (
            <div
              className="pointer input-clear"
              onClick={() => onChange && onChange('')}
            >
              <img
                src={clearImg}
                alt="검색어 초기화"
                style={{width: '16px'}}
              />
            </div>
          )}
          {hasSearchIcon && (
            <input
              type="image"
              alt="검색 버튼"
              className="search-icon"
              src={value && value.length
                ? searchOnImg
                : searchOffImg || searchOnImg}
            />
          )}
        </div>
      </form>
      {acList}
    </SearchInputDiv>
  );
});

export default SearchInput;

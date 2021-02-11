import * as React from "react";
import styled from "styled-components";
import {staticUrl} from "../../src/constants/env";
import {$BORDER_COLOR} from '../../styles/variables.types';
import cn from 'classnames';

const Div = styled.div`
  height: 57px;
  position: relative;
  top: 16px;
  padding-bottom: 15px;

  input[type="text"] {
    width: 100%;
    font-size: 15px;
    font-weight: normal;
    line-height: 1.2;
    padding-bottom: 15px;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  input::placeholder {
    color: #2b89ff;
  }
  
  img {
    position: absolute;
    width: 28px;
    top: 0;
    right: 0;
    padding-bottom: 7px;
  }
`;

interface ISearchInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
  placeholder?: string;
  className?: string;
  onSearch?: (keyword: string) => void;
}

const SearchInput: React.FC<ISearchInputProps> = ({
  onChange,
  value,
  placeholder,
  className,
  onSearch,
}) => {
  const onSearchKeyword = React.useCallback(({key, target: {value}}) => {
    if (key === 'Enter') {
      onSearch && onSearch(value);
    }
  }, [onSearch]);

  return (
    <Div className={cn('search-input', className)}>
      <input
        type="text"
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        onKeyUp={onSearchKeyword}
      />
      <img
        className="pointer"
        src={staticUrl('/static/images/icon/icon-search-input.png')}
        alt="검색"
        onClick={() => onSearch(value)}
      />
    </Div>
  )
};

SearchInput.displayName = 'SearchInput';
export default React.memo(SearchInput);

import * as React from "react";
import styled from "styled-components";
import {staticUrl} from "../../src/constants/env";
import cn from 'classnames';

const Div = styled.div`
  border-bottom: 1px solid #dddddd;
  height: 42px;
  position: relative;

  input {
    width: 100%;
    height:100%;
    font-size: 15px;
    font-weight: normal;
    line-height: 1.2;
  }

  input::placeholder {
    color: #2b89ff;
  }
  
  img {
    position: absolute;
    right: 0;
    bottom: 7px;
    width: 28px;
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
  onSearch
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
        src={staticUrl('/static/images/icon/icon-search.png')}
        alt="검색"
        onClick={() => onSearch(value)}
      />
    </Div>
  );
};

export default React.memo(SearchInput);

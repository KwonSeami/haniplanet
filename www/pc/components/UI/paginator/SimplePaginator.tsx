import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../../src/constants/env';

interface IContent {
  left: React.ReactNode;
  right: React.ReactNode;
}

export interface ISimplePaginatorProps {
  className?: string;
  children?: React.ReactNode;
  content?: IContent;
  currentPage?: number;
  lastPage?: number;
  prevClickEvent: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  nextClickEvent: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Div = styled.div`
  padding-left: 1px;

  button {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding-right: 1px;
    cursor: pointer;

    img {
      width: 17px;
      cursor: pointer;
    }
  }
`;

/**
 * 작업자: 임용빈
 * @param param0 
 */
const SimplePaginator = ({
  className,
  children,
  content: {
    left: leftContent,
    right: rightContent
  } = {
    left: null,
    right: null
  },
  currentPage,
  lastPage,
  prevClickEvent,
  nextClickEvent
}: ISimplePaginatorProps) => (
  <Div className={className}>
    <button onClick={(event) => prevClickEvent(event)}>
      {leftContent ? leftContent : (
        <img
          src={staticUrl('/static/images/icon/arrow/icon-arrow-left.png')}
          alt="이전"
        />
      )}
    </button>
    {currentPage && lastPage && (
      <p>{currentPage}/{lastPage}</p>
    )}
    {children}
    <button onClick={(event) => nextClickEvent(event)}>
      {rightContent || (
        <img
          src={staticUrl('/static/images/icon/arrow/icon-arrow-right.png')}
          alt="다음"
        />
      )}
    </button>
  </Div>
);

export default SimplePaginator;

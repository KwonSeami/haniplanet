import * as React from 'react';

// TabContnet 컴포넌트를 처음에 만드려 하다가, 탭 하단의 ButtonGroup 스타일이 모두 달라 공통 스타일을 분리하기 애매하며
// 이 점 때문에 prev, next, move의 용도가 불분명해져서, Compoent를 인자로 받아 prev, next, move를 props로 넘겨는 컴포넌트를 반환하는 hooks를 만듭니다.

export interface ITabContentMethod extends Indexable {
  prev?: () => void;
  next?: () => void;
  move?: () => void;
}

const useTabContent = ({prev, next, move, ...rest}: ITabContentMethod) =>
  (Child: React.ElementType, props?: any) => (
    <Child
      prev={prev}
      next={next}
      move={move}
      {...rest}
      {...props}
    />
  );

export default useTabContent;

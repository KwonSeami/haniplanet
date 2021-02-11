import * as React from 'react';

export interface ITabContentMethod extends Indexable {
  prev?: () => void;
  next?: () => void;
  move?: () => void;
}

const useTabContent = ({prev, next,move, ...rest}: ITabContentMethod) =>
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

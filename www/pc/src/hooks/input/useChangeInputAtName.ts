import * as React from 'react';

const useChangeInputAtName = (setState) =>
  React.useCallback(({target: {name, value}}) => {
    setState(current => ({ ...current, [name]: value }));
  }, []);

export default useChangeInputAtName;

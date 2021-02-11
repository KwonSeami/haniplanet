import * as React from 'react';

const useMultipleRef = (ids = []) => (
  React.useMemo(() => ids.reduce((prev, curr) => ({
    ...prev,
    [curr]: {current: undefined},
  }), {}), [ids])
);

export default useMultipleRef;

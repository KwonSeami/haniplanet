import * as React from 'react';
import isEqual from 'lodash/isEqual';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers/index';

const useCallAccessFunc = (callback) => {
  const {session: {access}} = useSelector(
    ({system}: RootState) => system,
    (prev, curr) => isEqual(prev, curr)
  );

  return React.useMemo(() => callback(access), [callback, access]);
};

export default useCallAccessFunc;

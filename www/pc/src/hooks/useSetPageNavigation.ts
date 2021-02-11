import * as React from 'react';
import {useDispatch} from 'react-redux';
import {setNavigation, clearNavigation} from '../reducers/system/style/styleReducer';

const useSetPageNavigation = (navigation: string) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!!navigation) {
      dispatch(setNavigation(navigation));
  
      return () => {
        dispatch(clearNavigation());
      };
    }
  }, [navigation]);
};

export default useSetPageNavigation;
import * as React from 'react';
import {useDispatch} from 'react-redux';
import {setFooterShow, clearFooter} from '../reducers/system/style/styleReducer';

const useSetFooter = (footer: boolean) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    
    dispatch(setFooterShow(footer));

    return () => {
      dispatch(clearFooter());
    };
    
  }, [footer]);
};

export default useSetFooter;
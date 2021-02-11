import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {RootState} from '../../reducers';
import {saveScrollThunk} from '../../reducers/scroll';
import debounce from 'lodash/debounce';

const useScroll = () => {
  const {asPath} = useRouter();

  const dispatch = useDispatch();

  const scroll = useSelector(({scroll}: RootState) => scroll);

  React.useEffect(() => {
    const saveScroll = debounce(() => dispatch(saveScrollThunk(asPath)), 200);

    window.addEventListener('scroll', saveScroll);

    return () => window.removeEventListener('scroll', saveScroll);
  }, []);

  return scroll;
};

export default useScroll;

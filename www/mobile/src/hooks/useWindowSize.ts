import * as React from 'react';
import debounce from 'lodash/debounce';

const getSize = () => typeof window !== 'undefined' && ({
  innerHeight: window.innerHeight,
  innerWidth: window.innerWidth,
  outerHeight: window.outerHeight,
  outerWidth: window.outerWidth,
});

const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState(getSize());

  React.useEffect(() => {
    const handleResize = debounce(() => setWindowSize(getSize()), 300);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;

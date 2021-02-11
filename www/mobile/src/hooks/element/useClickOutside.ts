import * as React from 'react';

const useClickOutside = <T extends HTMLElement>(ref: React.MutableRefObject<T> | Array<React.MutableRefObject<T>>) => {
  const [isClick, setIsClick] = React.useState(false);
  const handleClick = (e: MouseEvent) => {
    if (Array.isArray(ref)) {
      for (const {current} of ref) {
        if (!current) { return null; }
        if (current.contains(e.target as Node)) { return null; }
      }
    } else {
      if (!ref.current) { return null; }
      if (ref.current.contains(e.target as Node)) { return null; }
    }
    setIsClick(true);
  };

  React.useEffect(() => {
    isClick && setIsClick(false);
  }, [isClick]);

  React.useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref]);

  return isClick;
};

export default useClickOutside;
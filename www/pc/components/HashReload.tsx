import React from 'react';
import {useRouter} from 'next/router';

const HashReload = () => {
  const router = useRouter();
  const {asPath} = router;

  React.useEffect(() => {
    const checkUrlHashReg = new RegExp(/\#{1}\D{0,}/);

    if (checkUrlHashReg.test(asPath)) {
      const path = asPath.search(checkUrlHashReg)
        ? asPath.split('#')[0]
        : asPath;

      router.replace(`${path}#${asPath.split('#')[1]}`);
    }
  }, [asPath]);

  return null;
};

export default React.memo(HashReload);

import * as React from 'react';
import {AxiosPromise} from 'axios';

const useSaveApiResult = (api: (pk?: any) => AxiosPromise<any>, initPk?: any) => {
  const [resData, save] = React.useState();
  const [pk, setPk] = React.useState(initPk);
  const [rest, setRest] = React.useState({});

  React.useEffect(() => {
    const res = api && api(pk);
    res && res.then(({data}) => {
      const {result, results, ...rest} = data || {} as any;

      if (result || results) {
        save(result || results);
      } else {
        save(data);
      }
      setRest(rest);
    });
  }, [pk]);

  return {resData, setPk, rest};
};

export default useSaveApiResult;

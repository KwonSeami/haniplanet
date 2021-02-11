import {useRouter} from "next/router";

type TSetParameterCallback<T> = (query: T) => T;
type TSetParameter<T> = T extends Function ? T : TSetParameterCallback<T>
interface IRouterOptions {
  shallow: boolean;
}


const useSetQueryParam = <T = {}>() => {
  const router = useRouter();
  const {pathname, query} = router;
  
  const getUrl = (param, hash) => {
    const queryParam = typeof param === 'function' ? param(query) : param;
    
    return {
      pathname,
      hash,
      query: queryParam
    }
  }

  const pushQueryParam = (param: TSetParameter<T>, options?: IRouterOptions, hash?: string) => {
    const url = getUrl(param, hash);
    router.push(url, url, options || {});
  }
  const replaceQueryParam = (param: TSetParameter<T>, options?: IRouterOptions, hash?: string) => {
    const url = getUrl(param, hash);
    router.replace(url, url, options || {});
  }
  
  return {
    pushQueryParam,
    replaceQueryParam
  }
};

export default useSetQueryParam;
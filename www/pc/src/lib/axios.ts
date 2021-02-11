import axios from 'axios';
import {cacheAdapterEnhancer} from 'axios-extensions';
import {AxiosInstanceConfig} from '@hanii/planet-apis';

export const nodeAxiosInstance = (axiosConfig?: AxiosInstanceConfig) => {
  const {
    multipart = false,
    baseURL = '',
    token = '',
    tokenPrefix = 'Bearer',
  } = axiosConfig || {};

  axios.defaults.headers.post['Content-Type'] = multipart
    ? 'multipart/form-data'
    : 'application/json';
  axios.defaults.headers.patch['Content-Type'] = multipart
    ? 'multipart/form-data'
    : 'application/json';

  const instance = axios.create({
    baseURL,
    headers: token
      ? {
        Authorization: tokenPrefix + ' ' + token
      }
      : {},
    // @ts-ignore
    adapter: cacheAdapterEnhancer(axios.defaults.adapter),
  });

  instance.interceptors.response.use(
    res => {
      switch (res.status) {
        case 200:
        case 201:
        case 204:
          break;
      }

      return Promise.resolve(res);
    },
    err => {
      const {response} = err;
      const {status} = response || ({} as any);

      if ((response && status) && Math.floor(status / 100) === 4) {
        return Promise.resolve(response);
      }

      return Promise.reject(err);
    },
  );
  return instance;
};
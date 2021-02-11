import axios from 'axios';
import {cacheAdapterEnhancer} from 'axios-extensions';
import {TokenType} from '@dohyeon/planet-types';

export interface AxiosInstanceConfig {
  baseURL: string;
  multipart?: boolean;
  token?: TokenType;
  tokenPrefix?: string;
  sendBirdToken?: TokenType;
  errorCallback?: () => void;
}

export const axiosInstance = (axiosConfig?: AxiosInstanceConfig) => {
  const {
    multipart = false,
    baseURL = '',
    token = '',
    tokenPrefix = 'Bearer',
    sendBirdToken = '',
    errorCallback = null
  } = axiosConfig || {};

  axios.defaults.headers.post['Content-Type'] = multipart
    ? 'multipart/form-data'
    : 'application/json';
  axios.defaults.headers.patch['Content-Type'] = multipart
    ? 'multipart/form-data'
    : 'application/json';
  const instance = axios.create({
    baseURL,
    headers: {
      ...(token ? {Authorization: tokenPrefix + ' ' + token} : {}),
      ...(sendBirdToken ? {'Api-Token': sendBirdToken} : {})
    },
    // @ts-ignore
    adapter: cacheAdapterEnhancer(axios.defaults.adapter),
  });
  // instance.interceptors.request.use(null, function(err) {
  //     console.error('>> Axios Request Error: ' + err);
  //     return Promise.reject(err);
  // });
  const axiosIntercepter = instance.interceptors.response.use(
    res => {
      if (typeof window !== 'undefined' && console.group) {
        console.group(
          '%c** HTTP Request',
          'font-size:20px;color:#42f4c2;font-weight:bold;font-family:sans-serif',
        );
        console.log(
          // @ts-ignore
          `%c${res.config.url.split(res.config.baseURL).join('')}`,
          'font-size:14px;color:#333;',
        );
        console.log(
          `%cStatus: ${res.status}`,
          'font-size:14px;color:#2fcc00;font-family:sans-serif',
        );
        console.dir(res.data);
        console.groupEnd();
      }
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
      const {status, data} = response || ({} as any);

      if (response && status) {
        switch (Math.floor(status / 100)) {
          case 4:
            if (status === 401) {
              axios.interceptors.response.eject(axiosIntercepter);
            }

            if (errorCallback) {
              errorCallback();
            } else if (data.error || data.message) {
              alert(data.message);
            }
            
            return Promise.resolve(response);
          case 5:
            typeof alert !== 'undefined' &&
            alert('서버에서 오류가 발생했습니다. 관리자에게 문의하세요');
        }
        console.log(status);
        console.log(data.message);
      }
      return Promise.reject(err);
    },
  );
  return instance;
};

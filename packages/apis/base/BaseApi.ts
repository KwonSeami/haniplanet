import {AxiosInstance} from 'axios';
import {TokenType} from '@dohyeon/planet-types';
import {ApiConfig} from '../types/Api.type';
import {axiosInstance} from './axios.config';

export class BaseApi {
  public token: TokenType;
  public axios: AxiosInstance;
  public model: string;
  public baseURL: string;

  constructor(config: ApiConfig) {
    const {token, model = '', baseURL = '', ...rest} = config;
    this.token = token || '';
    this.model = model;
    this.baseURL = baseURL;
    this.axios = axiosInstance({token, baseURL, ...rest});
  }

  public getAxios() {
    return this.axios;
  }

  public noCache(url: string, params = {}) {
    return this.getAxios().get(url, {
      params: {
        ...params,
        cacheTime: new Date().getTime(),
      },
    });
  }
}

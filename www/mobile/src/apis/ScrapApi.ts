import {axiosInstance, Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class ScrapApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'og-link', baseURL: BASE_URL});
  }

  static urlScrap(form: Indexable) {
    return axiosInstance({baseURL: BASE_URL, errorCallback: () => null}).post('/og-link/', form);
  }
}

export default ScrapApi;

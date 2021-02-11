import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class HospitalApi extends Api {
  constructor(token: TokenType) {
    super({
      token,
      model: 'hospital' ,
      baseURL: BASE_URL
    });
  }

  search(keyword: string, offset: number, limit: number) {
    return this.getAxios().get(`${this.model}/`, {
      params: {
        q: keyword,
        offset,
        limit
      }
    })
  }
}

export default HospitalApi;
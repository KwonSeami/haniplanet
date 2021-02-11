import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class PointApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'point', baseURL: BASE_URL});
  }

  product() {
    return this.retrieve('product');
  }
  withdrawal(form = {}) {
    return this.getAxios().post(`/${this.model}/withdrawal/`, form);
  }
  withdrawalList() {
    return this.retrieve('withdrawal');
  }
}

export default PointApi;

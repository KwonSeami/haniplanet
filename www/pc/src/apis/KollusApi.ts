import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class KollusApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'kollus', baseURL: BASE_URL});
  }

  jwtToken(form) {
    return this.getAxios().post(`/${this.model}/token/`, form);
  }
}

export default KollusApi;

import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class ModuApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'price-comparison', baseURL: BASE_URL});
  }
}
export default ModuApi;

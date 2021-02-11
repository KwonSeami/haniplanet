import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class PaymentApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'payment', baseURL: BASE_URL});
  }

  iamport(form) {
    return this.getAxios().post(`/${this.model}/iamport/`, form);
  }
}

export default PaymentApi;

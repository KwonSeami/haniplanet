import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class ShoppingApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'shopping', baseURL: BASE_URL});
  }

  carts (params) {
    return this.getAxios().get(`${this.model}/cart/`, params);
  }

  createCart (id: string, params) { 
    return this.getAxios().post(`${this.model}/goods/${id}/cart/`, params);
  }

  updateCart(id: string, params) {
    return this.getAxios().patch(`${this.model}/cart/${id}/`, params);
  }

  deleteCart(params) {
    return this.getAxios().delete(`${this.model}/cart/bulk/`, {
      params
    });
  }

  payment(cart_ids: string[], delivery) {
    return this.getAxios().post(`${this.model}/cart/reservation/`, {cart_ids, delivery});
  }
}

export default ShoppingApi;
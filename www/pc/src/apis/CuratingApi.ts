import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class CuratingApi extends Api {
  constructor(token: TokenType) {
    super({
      token,
      model: 'curating',
      baseURL: BASE_URL
    });
  }

  children(contentPk: number) {
    return this.getAxios().get(`/${this.model}/content/${contentPk}/children/`);
  }
}

export default CuratingApi;

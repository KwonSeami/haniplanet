import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class TagApi extends Api {
  constructor(token: TokenType) {
    super({
      token,
      model: 'tag',
      baseURL: BASE_URL
    });
  }
  public story(id: HashId) {
    return this.getAxios().get(`/tag/${id}/story/`);
  }
}

export default TagApi;

import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class FollowApi extends Api {
  constructor(token: TokenType) {
    super({
      token,
      model: 'follow',
      baseURL: BASE_URL
    });
  }

  tag(tagId: HashId) {
    return this.getAxios().patch(`/${this.model}/tag/${tagId}/`);
  }

  tagList() {
    return this.getAxios().get(`/${this.model}/tag/`);
  }

  user(id: HashId) {
    return this.getAxios().patch(`/${this.model}/user/${id}/`);
  }

  story(id: HashId) {
    return this.getAxios().patch(`/${this.model}/story/${id}/`);
  }
}

export default FollowApi;

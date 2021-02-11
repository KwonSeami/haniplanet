import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class FeedApi extends Api {
  constructor(token: TokenType) {
    super({
      token,
      model: 'feed',
      baseURL: BASE_URL
    });
  }

  user() {
    return this.retrieve('user');
  }

  tag(params?: object) {
    return this.retrieve('tag', params);
  }

  band(band_type: 'moa' | 'consultant' | 'onclass') {
    return this.retrieve('band', {band_type});
  }

  onclass() {
    return this.retrieve('onclass');
  }
}

export default FeedApi;

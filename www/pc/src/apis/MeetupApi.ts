import {axiosInstance, Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class MeetupApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'meetup', baseURL: BASE_URL});
  }

  public follow(storyPk: HashId) {
    return this.getAxios().patch(`/follow/story/${storyPk}/`);
  }

  search(keyword: string, offset: number, limit: Number) {
    return this.getAxios().get(`${this.model}/`, {
      params: {
        q: keyword,
        offset,
        limit
      }
    })
  }

  option() {
    return this.retrieve('option');
  }
}

export default MeetupApi;

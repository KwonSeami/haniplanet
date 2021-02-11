import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';
import {HashId} from '@hanii/planet-types';

class TimelineApi extends Api {
  constructor(token?: TokenType) {
    super({ token, model: 'timeline', baseURL: BASE_URL });
  }

  newStory(id: HashId, form: object) {
    return this.getAxios().post(`/${this.model}/${id}/story/`, form);
  }

  detail(timelinePk: HashId, storyPk: HashId) {
    return this.getAxios().get(`${this.model}/${timelinePk}/story/${storyPk}/`);
  }

  list(timelinePk: HashId, params: Indexable) {
    return this.getAxios().get(`${this.model}/${timelinePk}/story/`, {params});
  }

  update(timelinePk: HashId, storyPk: HashId, form) {
    return this.getAxios().patch(`${this.model}/${timelinePk}/story/${storyPk}/`, form);
  }
}

export default TimelineApi;

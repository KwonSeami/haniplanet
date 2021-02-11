import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class ExploreApi extends Api {
  constructor(token: TokenType) {
    super({
      token,
      model: 'explore',
      baseURL: BASE_URL
    });
  }

  main() {
    return this.getAxios().get(`/${this.model}/main/`);
  }

  story(params?: Indexable) {
    return this.getAxios().get(`/${this.model}/story/`, {
      params
    });
  }

  menu() {
    return this.getAxios().get(`/${this.model}/menu/`);
  }

  detail(id: string) {
    return this.getAxios().get(`${this.model}/story/${id}/`);
  }

  public createStory(form: object) {
    return this.getAxios().post(`/${this.model}/story/`, form);
  }

  public updateStory(storyPK: HashId, form: object) {
    return this.getAxios().patch(`/${this.model}/story/${storyPK}/`, form);
  }

  pageMain() {
    return this.getAxios().get(`/${this.model}/page/main/`);
  }
}

export default ExploreApi;

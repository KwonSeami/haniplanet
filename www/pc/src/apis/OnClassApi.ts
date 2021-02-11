import {axiosInstance, Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class OnClassApi extends Api {
  constructor(token?: TokenType) {
    super({
      token,
      model: 'onclass',
      baseURL: BASE_URL
    });
  }

  onclassList(slug: string, params: Indexable) {
    return this.getAxios().get(`/${this.model}/${slug}/contents/`, {params});
  }

  onclassProgress(slug: string, form?: Indexable) {
    return this.getAxios().post(`/${this.model}/${slug}/contents/play/`, form);
  }
}

export default OnClassApi;
import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class DoctalkApi extends Api {
  constructor(token: TokenType) {
    super({
      token,
      model: 'doctalk',
      baseURL: BASE_URL
    });
  }

  linkToDoctalk(form: Indexable) {
    return this.getAxios().post(`/${this.model}/user/`, form);
  }

  faq(pkId: HashId) {
    return this.getAxios().get(`${this.model}/faq/${pkId}/`);
  }

  faqList(params) {
    return this.getAxios().get(`/${this.model}/faq/`, params);
  }

  createFaq(form: IDocTalkFaq) {
    return this.getAxios().post(`/${this.model}/faq/`, form);
  }

  updateFaq(pkId: HashId, form: IDocTalkFaq) {
    return this.getAxios().patch(`/${this.model}/faq/${pkId}/`, form);
  }

  deleteFaq(pkId: HashId) {
    return this.getAxios().delete(`${this.model}/faq/${pkId}/`);
  }
}

export default DoctalkApi;

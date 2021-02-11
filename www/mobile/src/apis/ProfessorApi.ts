import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class ProfessorApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'professor', baseURL: BASE_URL});
  }

  patchRating(ratingPk: HashId, form: Indexable) {
    return this.getAxios().patch(`/${this.model}/${ratingPk}/rating/`, form);
  }
  createRating(ratingPk: HashId, form: Indexable) {
    return this.getAxios().post(`/${this.model}/${ratingPk}/rating/`, form);
  }
}
export default ProfessorApi;

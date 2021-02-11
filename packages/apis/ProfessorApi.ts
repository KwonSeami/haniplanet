import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants';


class ProfessorApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'professor', baseURL: BASE_URL});
  }
}

export default ProfessorApi;

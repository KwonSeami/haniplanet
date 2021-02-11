import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class RegionApi extends Api {
  constructor(token: HashId) {
    super({token, model: 'region', baseURL: BASE_URL});
  }
}

export default RegionApi;

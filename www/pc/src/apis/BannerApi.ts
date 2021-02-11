import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class BannerApi extends Api {
  constructor() {
    super({ model: 'banner', baseURL: BASE_URL });
  }

  topBanner() {
    return this.list({
      service:'main',
      position:'top'
    });
  }
  rightBanner() {
    return this.list({
      service:'main',
      position:'side'
    });
  }
}


export default BannerApi;


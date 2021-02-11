import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class ProfileApi extends Api {
  constructor(token: TokenType) {
    super({
      token,
      model: 'profile',
      baseURL: BASE_URL
    });
  }

  config() {
    return this.retrieve('config');
  }

  changeOpenRange(form: {
    [key: keyof IOpenType]: TProfileOpenRange
  }) {
    return this.getAxios().patch(`/${this.model}/config/`, form);
  }

  skillField() {
    return this.retrieve('field');
  }

  skillDetail() {
    return this.retrieve('skill');
  }

  tool() {
    return this.retrieve('tool');
  }
}

export default ProfileApi;

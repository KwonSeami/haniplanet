import Url from '../Url';

class FindInfoUrl extends Url {
  id: string;
  password: string;

  constructor() {
    super('find');

    this.id = this.detail('id');
    this.password = this.detail('password');
  }
}

const FIND_INFO_URL = new FindInfoUrl();
export default FIND_INFO_URL;

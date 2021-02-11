import * as queryString from 'query-string';

class Url {
  public model: string;
  public default: string;
  public list: string;

  constructor(_model: string) {
    this.model = _model;
    this.default = `/${_model}`;
    this.list = this.default;
  }

  public detail(...args) {
    return `${this.default}${args.map(arg => `/${arg}`).join('')}`;
  }

  public addQuery(params) {
    return params ? '?' + queryString.stringify(params) : '';
  }
}

export default Url;

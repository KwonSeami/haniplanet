import {Id, HashId, Indexable} from '@dohyeon/planet-types';
import {BaseApi} from './BaseApi';

export class Api extends BaseApi {
  retrieve(modelId: Id | HashId, params: Indexable = {}) {
    return this.noCache(`/${this.model}/${modelId}/`, params);
  }

  list(params?: Indexable) {
    return this.noCache(`/${this.model}/`, params);
  }

  create(form: Indexable) {
    return this.getAxios().post(`/${this.model}/`, form);
  }

  partial_update(modelId: Id | HashId, form: Indexable) {
    return this.getAxios().patch(`/${this.model}/${modelId}/`, form);
  }

  delete(modelId: Id | HashId, params: Indexable = {}) {
    return this.getAxios().delete(`/${this.model}/${modelId}/`, {params});
  }
}

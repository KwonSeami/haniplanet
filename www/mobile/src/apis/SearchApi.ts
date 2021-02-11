import {Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class SearchApi extends Api {
  constructor(token?: TokenType) {
    super({
      token,
      model: 'search',
      baseURL: BASE_URL
    });
  }

  rank() {
    return this.retrieve('rank');
  }

  keyword(search: string) {
    return this.getAxios().get(`/${this.model}/keyword/`, {
      params: {
        q: search
      }
    });
  }

  integrate(keyword: string) {
    return this.getAxios().get(`/${this.model}/`, {
      params: {
        q: keyword
      }
    })
  }

  story(keyword: string, offset: number, orderBy: string, limit: number) {
    return this.getAxios().get(`${this.model}/story/`, {
      params: {
        q: keyword,
        order_by: orderBy,
        offset,
        limit
      }
    })
  }

  band(keyword: string, bandType: string, offset: number, limit: number) {
    return this.getAxios().get(`/${this.model}/band/`, {
      params: {
        q: keyword,
        band_type: bandType,
        offset,
        limit
      }
    });
  }

  meetup(keyword: string, offset: number, limit: number) {
    return this.getAxios().get(`${this.model}/meetup/`, {
      params: {
        q: keyword,
        offset,
        limit
      }
    })
  }

  user(name: string) {
    return this.getAxios().get(`/${this.model}/user/`, {
      params: {
        q: name
      }
    });
  }

  deleteSearchHistory(keyword?: string) {
    return this.getAxios().delete(`/${this.model}/history/`, keyword
      ? {
        params: {
          q: keyword
        }
      }
      : {}
    );
  }

  hospitalAutoComplete(keyword: string, form?: {
    band_limit?: number;
    category_limit?: number;
  }) {
    return this.getAxios().get(`/${this.model}/hospital-autocomplete/`, {
      params: {
        q: keyword,
        ...(form || {})
      }
    });
  }
}


export default SearchApi;

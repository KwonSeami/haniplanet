import {axiosInstance, Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class BandApi extends Api {
  constructor(token: TokenType) {
    super({
      token,
      model: 'band',
      baseURL: BASE_URL
    });
  }

  detail(slug: string) {
    return this.retrieve(slug);
  }

  category(form: Indexable) {
    return this.retrieve('category', form);
  }

  question(slug: string) {
    return this.noCache(`/${this.model}/${slug}/question/`);
  }

  join(slug: string, form: Indexable) {
    return this.getAxios().post(`/${this.model}/${slug}/member/`, form);
  }

  static hospital(name: string) {
    return axiosInstance({baseURL: BASE_URL}).get(`${this.model}/${name}/`);
  }

  static bandCount(form: Indexable) {
    return axiosInstance({baseURL: BASE_URL}).get('/band/count/', form);
  }

  myBand(option) {
    return this.retrieve('me', option);
  }

  addTimeline(slug: string, newTimeline: { name: string; order: number; }) {
    return this.getAxios().post(`/${this.model}/${slug}/timeline/`, newTimeline);
  }

  deleteTimeline(slug: string, timelineId: HashId) {
    return this.getAxios().delete(`/${this.model}/${slug}/timeline/${timelineId}/`);
  }

  editTimeline(slug: string, timelineId: HashId, name: {name: string}) {
    return this.getAxios().patch(`/${this.model}/${slug}/timeline/${timelineId}/`, name);
  }

  getBandMemberList(params: {
    slug: string,
    status: 'ongoing' | 'active',
    option?: Indexable
  }) {
    const {
      slug,
      status,
      option
    } = params;

    return this.getAxios().get(`/${this.model}/${slug}/member/`, {
      params: {
        status,
        ...(option || {})
      }
    });
  }

  getAppliedMember(slug: string, memberId: HashId) {
    return this.getAxios().get(`/${this.model}/${slug}/member/${memberId}/`);
  }

  approveAppliedMember(slug: string, memberId: HashId) {
    return this.getAxios().patch(`/${this.model}/${slug}/member/${memberId}/`, { 
      status: 'active'
    });
  }

  // @정윤재-TODO: 내 정보 leaveMoa 메서드와 통합할 수 있도록 할 것
  denyAppliedMember(slug: string, memberId: HashId) {
    return this.getAxios().delete(`${this.model}/${slug}/member/${memberId}/`);
  }

  myBandList() {
    return this.retrieve('me');
  }

  me(slug: string) {
    return this.getAxios().get(`/${this.model}/${slug}/me/`);
  }

  checkNickname(slug: string, nickname: string) {
    return this.getAxios().get(`/${this.model}/${slug}/nickname/`, {
      params: {
        q: nickname
      }
    });
  }

  leaveMoa(slug: string, memberId: HashId) {
    return this.getAxios().delete(`/${this.model}/${slug}/member/${memberId}/`);
  }

  changeNickname(slug: string, memberId: HashId, newNickname: string) {
    return this.getAxios().patch(`/${this.model}/${slug}/member/${memberId}/`, {
      nick_name: newNickname
    });
  }

  registerHospitalMember(slug: string, form: Indexable) {
    return this.getAxios().post(`/${this.model}/${slug}/hospital-member/`, form);
  }

  patchHospitalMember(slug: string, id: HashId, form: Indexable) {
    return this.getAxios().patch(`/${this.model}/${slug}/hospital-member/${id}/`, form);
  }

  removeHospitalMember(slug: string, id: HashId) {
    return this.getAxios().delete(`/${this.model}/${slug}/hospital-member/${id}/`);
  }

  imageUpload(form: Indexable) {
    return this.getAxios().post(`/${this.model}/banner/`, form);
  }

  onclassList(slug: string, params) {
    return this.getAxios().get(`/${this.model}/${slug}/onclass/`, {params});
  }

  onclassProgress(slug: string, form) {
    return this.getAxios().post(`/${this.model}/${slug}/onclass/play/`, form);
  }
}

export default BandApi;

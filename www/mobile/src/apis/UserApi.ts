import {axiosInstance, Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class UserApi extends Api {
  constructor(token?: TokenType) {
    super({
      token,
      model: 'user',
      baseURL: BASE_URL
    });
  }

  static login(form: object) {
    return axiosInstance({baseURL: BASE_URL}).post('/auth/token/', form);
  }

  static sign(type: string, form: object) {
    return axiosInstance({
      multipart: true,
      baseURL: BASE_URL
    }).post(`/user/signup/${type}/`, form);
  }

  static verifyCode(form: object) {
    return axiosInstance({baseURL: BASE_URL}).post('/auth/verify/code/', form);
  }

  static findInfo(form: object) {
    return axiosInstance({baseURL: BASE_URL}).post('/user/find/', form);
  }

  static updatePassword(form: object) {
    return axiosInstance({baseURL: BASE_URL}).patch('/user/password/', form);
  }

  // ID 중복 체크
  static authId(id: string) {
    return axiosInstance({baseURL: BASE_URL}).get(`/user/auth_id/?q=${id}`);
  }
  static authNickName(id: string) {
    return axiosInstance({baseURL: BASE_URL}).get(`/user/nick-name/?q=${id}`);
  }

  //총 유저 수
  static allUserCount() {
    return axiosInstance({baseURL: BASE_URL}).get('/user/count/');
  }

  //세미나 취소
  public cancelApply(userPk: HashId, applyPk: HashId, form) {
    return this.getAxios().patch(`/${this.model}/${userPk}/apply/${applyPk}/`, form);
  }

  me() {
    return this.retrieve('me');
  }

  getProfileAdditionalInfo(id: HashId, name: TProfileFormName) { 
    return this.getAxios().get(`/${this.model}/${id}/${name}/`);
  }

  addProfileForm(name: string, id: HashId, form: TProfileFormParamsExceptId) {
    return this.getAxios().post(`/${this.model}/${id}/${name}/`, form);
  }

  deleteProfileForm(name: string, id: HashId, formId: HashId) {
    return this.getAxios().delete(`/${this.model}/${id}/${name}/${formId}/`);
  }

  editProfileForm(name: string, id: HashId, formId: HashId, form: TProfileFormParamsExceptId) {
    return this.getAxios().patch(`/${this.model}/${id}/${name}/${formId}/`, form);
  }
  
  alarm(userPk: HashId) {
    return this.getAxios().get(`/user/${userPk}/alarm/`);
  }

  readAllAlarm(userPk: HashId) {
    return this.getAxios().patch('/alarm/me/', userPk);
  }

  follower(id: HashId) {
    return this.getAxios().get(`${this.model}/${id}/follower/`);
  }

  following(id: HashId) {
    return this.getAxios().get(`${this.model}/${id}/following/`);
  }

  newStory(userId: HashId, form: Indexable) {
    return this.getAxios().post(`/${this.model}/${userId}/story/`, form);
  }

  hospital() {
    return this.retrieve('hospital');
  }

  hospitalInfo(id: HashId) {
    return this.getAxios().get(`/${this.model}/${id}/hospital/`);
  }

  saveMyInfo(form: Indexable) {
    return this.getAxios().patch(`/${this.model}/me/`, form);
  }

  deleteProfileAvatar() {
    return this.getAxios().delete(`/${this.model}/me/avatar/`);
  }

  patchMe(form: Indexable) {
    return this.getAxios().patch(`/${this.model}/me/`, form);
  }

  withdraw() {
    return this.getAxios().delete(`${this.model}/me/leave/`);
  }

  delayPasswordWarnedAt() {
    return this.getAxios().patch(`/${this.model}/password-warned/`, {
      is_delay: true
    });
  }

  swapProfilFormOrder(name: 'edu' | 'brief' | 'thesis', swapId1, swapId2) {
    return this.getAxios().patch(`/${this.model}/${name}/order/`, {
      obj_id_to_swap_1: swapId1,
      obj_id_to_swap_2: swapId2
    });
  }

  activate() {
    return this.getAxios().patch(`/${this.model}/me/activate/`);
  }

  proxy(form: Indexable) {
    return this.getAxios().patch(`/${this.model}/proxy/`, form);
  }

  myMeetup(params: any) {
    return this.noCache(`/${this.model}/me/meetup/`, params);
  }

  hospitalBanner(userPk: HashId) {
    return this.getAxios().get(`${this.model}/${userPk}/first-banner/`);
  }
}

export default UserApi; 

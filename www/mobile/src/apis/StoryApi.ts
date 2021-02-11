import {axiosInstance, Api} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class StoryApi extends Api {
  constructor(token: TokenType) {
    super({token, model: 'story', baseURL: BASE_URL});
  }

  static newStory(form: object) {
    return axiosInstance({baseURL: BASE_URL}).post('/story/', form);
  }

  public paymentDetail(id: HashId) {
    return this.noCache(`/${this.model}/payment/${id}/`);
  }

  public reaction(storyPk: HashId, reactionType: TReactionType) {
    return this.getAxios().patch(`/${this.model}/${storyPk}/reaction/${reactionType}/`);
  }

  public report(storyPk: HashId, form: Indexable) {
    return this.getAxios().post(`/${this.model}/${storyPk}/report/`, form);
  }

  public reply(storyPk: HashId, form: Indexable) {
    return this.getAxios().post(`/${this.model}/${storyPk}/reply/`, form);
  }

  public upload(type: 'file' | 'image', form: Indexable) {
    return this.getAxios().post(`/${this.model}/assets/${type}/`, form);
  }

  public blockStory(storyPk: HashId) {
    return this.getAxios().post(`/feed/story/${storyPk}/blacklist/`);
  }

  public blockUser(userPk: HashId) {
    return this.getAxios().post(`/feed/user/${userPk}/blacklist/`);
  }

  public follow(id: HashId) {
    return this.getAxios().patch(`/follow/story/${id}/`);
  }

  public qnaUp(id: HashId) {
    return this.getAxios().post(`/story/${id}/qna/up/`);
  }

  public patchApply(storyPk: HashId, applyPk: unknown, form) {
    return this.getAxios().patch(`/story/${storyPk}/apply/${applyPk}/`, form);
  }

  public apply(storyPk: HashId, form) {
    return this.getAxios().post(`/story/${storyPk}/apply/`, form);
  }

  public reservation(storyPk: HashId, form) {
    return this.getAxios().post(`/story/${storyPk}/reservation/`, form);
  }

  public payment(storyPk: HashId, form) {
    return this.getAxios().post(`/story/${storyPk}/payment/`, form);
  }

  public deleteAttach(storyPk, attachType, attachPk) {
    return this.getAxios().delete(`/${this.model}/${storyPk}/${attachType}/${attachPk}/`);
  }

  focus(storyPk: HashId) {
    return this.getAxios().get(`/${this.model}/${storyPk}/focus/`);
  }
  lookUpPoint(storyPk: HashId) {
    return this.getAxios().get(`/${this.model}/${storyPk}/point/`);
  }
  spendPoint(storyPk: HashId, form) {
    return this.getAxios().post(`/story/${storyPk}/point/`, form);
  }

  extendTo(storyPk: HashId) {
    return this.getAxios().get(`/${this.model}/${storyPk}/extend-to/`);
  }
}

export default StoryApi;

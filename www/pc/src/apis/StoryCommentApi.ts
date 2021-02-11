import {BaseApi} from '@hanii/planet-apis';
import {BASE_URL} from '../constants/env';

class StoryCommentApi extends BaseApi {
  constructor(access: string){
    super({token: access, baseURL: BASE_URL});
  }
  list(storyPk, params){
    return this.noCache(`/story/${storyPk}/comment/`, {...params});
  }
  replyList(storyPk, commentPk, params){
    return this.noCache(`/story/${storyPk}/comment/${commentPk}/comment/`, {params});
  }
  createReply(storyPk, commentPk, form){
    return this.getAxios().post(`/story/${storyPk}/comment/${commentPk}/comment/`, form);
  }
  create(storyPk, form){
    return this.getAxios().post(`/story/${storyPk}/comment/`, form);
  }
  destroy(storyPk, commentPk){
    return this.getAxios().delete(`/story/${storyPk}/comment/${commentPk}/`);
  }
  retrieve(storyPk, commentPk){
    return this.getAxios().get(`/story/${storyPk}/comment/${commentPk}/`);
  }
  reaction(storyPk, commentPk, reactionType){
    return this.getAxios().patch(`/story/${storyPk}/comment/${commentPk}/reaction/${reactionType}/`);
  }
  report(storyPk, commentPk, form){
    return this.getAxios().post(`/story/${storyPk}/comment/${commentPk}/report/`, form);
  }
  upload(form){
    return this.getAxios().post(`/story/comment/assets/file/`, form);
  }
}

export default StoryCommentApi;

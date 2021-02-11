import storyReducer from './story/storyReducer';
import tagReducer from './tag/tagReducer';
import storyHasTagReducer from './relations/storyHasTagReducer';
import tagListReducer from './tag/tagListReducer';
import bandReducer from './band/bandReducer';
import bandHasTimelineReducer from './relations/bandHasTimelineReducer';
import timelineReducer from './timeline/timelineReducer';
import userReducer, {userLogout, userLogin} from './user/userReducer';
import userFollowReducer from './user/follow/userFollowReducer';
import userListReducer from './user/userListReducer';
import memberReducer from './member/memberReducer';
import memberListReducer from './member/memberListReducer';
import {DEFAULT_ORM_STATE} from './assets';

const ormReducer = (state, action) => {
  if(action.type === userLogout.toString() || action.type === userLogin.toString()) {
    // 유저가 로그인 또는 로그아웃할 경우 데이터 초기화
    return {...DEFAULT_ORM_STATE};
  }

  return {
    story: storyReducer(state && state.story, action),
    tag: tagReducer(state && state.tag, action),
    tagList: tagListReducer(state && state.tagList, action),
    storyHasTag: storyHasTagReducer(state && state.storyHasTag, action),
    band: bandReducer(state && state.band, action),
    bandHasTimeline: bandHasTimelineReducer(state && state.bandHasTimeline, action),
    timeline: timelineReducer(state && state.timeline, action),
    user: userReducer(state && state.user, action),
    userFollowList: userFollowReducer(state && state.userFollowList, action),
    userList: userListReducer(state && state.userList, action),
    member: memberReducer(state && state.member, action),
    memberList: memberListReducer(state && state.memberList, action),
  };
};

export default ormReducer;

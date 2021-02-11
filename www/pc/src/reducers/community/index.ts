import {createActions, handleActions} from 'redux-actions';
import {IStory} from '../../@types/story';

export interface ICommunityCategory {
  id: HashId;
  name: string;
  story_count: number;
}

export interface ICommunityComment {
  id: HashId;
  text: string;
  story: {
    id: HashId;
    title: string;
  };
}

export interface ICommunityStory extends Pick<IStory, 'id'
  | 'title'
  | 'up_count'
  | 'comment_count'
  | 'retrieve_count'
  | 'created_at'
> {
  menu_tag: {
    id: HashId;
    name: string;
  };
}

export interface ICommunityPayload {
  daily_stories: ICommunityStory[];
  weekly_stories: ICommunityStory[];
  monthly_stories: ICommunityStory[];
  latest_stories: ICommunityStory[];
  latest_comments: ICommunityComment[];
  get_my_history_stories: ICommunityStory[];
}

export const DEFAULT_COMMUNITY_STATE = {
  daily_stories: [], // 일간 베스트 글
  weekly_stories: [], // 주간 베스트 글
  monthly_stories: [], // 월간 베스트 글
  latest_stories: [], // 실시간 커뮤니티 글
  latest_comments: [], // 실시간 커뮤니티 댓글
  get_my_history_stories: [], // 내가 본 글
};

export const SAVE_COMMUNITY = 'SAVE_COMMUNITY';

export const {saveCommunity} = createActions({
  [SAVE_COMMUNITY]: (data: ICommunityPayload) => data
});

const community = handleActions(
  {
    [saveCommunity.toString()]: (state, {payload}) => ({
      ...state,
      ...payload
    })
  },
  DEFAULT_COMMUNITY_STATE
);

export default community;

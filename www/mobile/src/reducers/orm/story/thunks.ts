import StoryApi from '../../../apis/StoryApi';
import {saveStory, updateStory, delStory, bulkDelStory} from './storyReducer';
import {pickStorySelector} from './selector';
import {createBrowserHistory} from 'history';
import {timeOver} from '../../../lib/date';
import {MINUTE} from '../../../constants/times';
import {AxiosError} from 'axios';
import {HashId} from '@hanii/planet-types';
import {deleteFeedList} from '../../feed';
import TimelineApi from '../../../apis/TimelineApi';


export const toggleStoryReactionThunk = (storyPk: HashId, reactionType: 'up' | 'down') =>
  (dispatch, getState) => {
    const {system: {session: {access}}, orm} = getState();
    if (access) {
      const {up_count, down_count, reaction_type: oldReactionType} = pickStorySelector(storyPk)(orm);
      const api = new StoryApi(access);
      api.reaction(storyPk, reactionType)
        .then(res => {
          if (res.status === 200) {
            const {data: {result: {reaction_type}}} = res;
            dispatch(
              updateStory(
                storyPk,
                {
                  reaction_type,
                  up_count: reactionType === 'up' ?
                    reaction_type === 'up' ?
                      up_count + 1 :
                      up_count - 1 :
                    oldReactionType === 'up' ?
                      up_count - 1 :
                      up_count,
                  down_count: reactionType === 'down' ?
                    reaction_type === 'down' ?
                      down_count + 1 :
                      down_count - 1 :
                    oldReactionType === 'down' ?
                      down_count - 1 :
                      down_count,
                },
              ),
            );
          }
        });
    } else {
      const history = createBrowserHistory({
        forceRefresh: true,
      });
      confirm('글에 대한 액션은 로그인 후 가능합니다. 로그인 페이지로 이동하시겠습니까?') && history.push('/login');
    }
  };

export const fetchStoryThunk = (storyPk: HashId, duration = 30 * MINUTE, callback?: () => void) =>
  (dispatch, getState) => {
    const {system: {session: {access}}, orm} = getState();
    const api = new StoryApi(access);
    const {retrieved_at} = pickStorySelector(storyPk)(orm) || {} as any;
    if (!retrieved_at || timeOver(retrieved_at, duration)) {
      api.retrieve(storyPk)
        .then(({status, data}) => {
          if (Math.floor(status / 100) === 4) {
            dispatch(errorOccuredStoryThunk(storyPk, {
              ...data,
              status
            }));
          } else {
            !!data.result && dispatch(saveStory({...data.result, retrieved_at: new Date().getTime()}));
            callback && callback();
          }
        })
        .catch(err => {
          dispatch(errorOccuredStoryThunk(storyPk, err.response));
        });
    }
  };

export const fetchTimelineStoryThunk = (timelinePk: HashId, storyPk: HashId, duration = 30 * MINUTE, callback?: () => void) =>
  (dispatch, getState) => {
    const {system: {session: {access}}, orm} = getState();
    const api = new TimelineApi(access);
    const {retrieved_at} = pickStorySelector(storyPk)(orm) || {} as any;
    if (!retrieved_at || timeOver(retrieved_at, duration)) {
      api.detail(timelinePk, storyPk)
        .then(({status, data}) => {
          if (Math.floor(status / 100) === 4) {
            dispatch(errorOccuredStoryThunk(storyPk, {
              ...data,
              status
            }));
          } else {
            !!data.result && dispatch(saveStory({...data.result, retrieved_at: new Date().getTime()}));
            callback && callback();
          }
        })
        .catch(err => {
          dispatch(errorOccuredStoryThunk(storyPk, err.response));
        });
    }
  };

export const toggleFollowStoryThunk = (storyPk: HashId) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    if (access) {
      const api = new StoryApi(access);
      api.follow(storyPk)
        .then(res => {
          if (res.status === 200) {
            dispatch(
              updateStory(
                storyPk,
                ({is_follow, ...rest}) => ({
                  ...rest,
                  is_follow: !is_follow,
                }),
              ),
            );
          }
        });
    }
  };

export const sendStoryReportThunk = (storyPk: HashId, form: Indexable) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    if (access) {
      const api = new StoryApi(access);
      api.report(storyPk, form)
        .then(({status}) => {
          if (Math.floor(status / 100) !== 4) {
            alert('신고되었습니다.');
            return dispatch(updateStory(storyPk, {is_report: true}));
          }
        });
    } else {
      alert('로그인 후 이용 가능합니다.');
    }
  };

export const deleteStoryThunk = (storyPk: HashId, confirmMessage?: string, callback?: () => void) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    if (confirm(confirmMessage || '삭제하면 복구가 불가능합니다. 삭제하시겠습니까?')) {
      if (access) {
        const api = new StoryApi(access);
        api.delete(storyPk)
          .then(({status}) => {
            if (Math.floor(status / 100) !== 4) {
              dispatch(delStory(storyPk));
              callback && callback();
            }
          });
      } else {
        alert('로그인 후 이용 가능합니다.');
      }
    }
  };

export const blockStoryThunk = (storyPk: HashId) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    if(access) {
      new StoryApi(access).blockStory(storyPk)
        .then(({status}) => {
          if (Math.floor(status / 100) !== 4) {
            return dispatch(delStory(storyPk));
          }
        });
    }
  };

export const blockUserThunk = (userPk: HashId, asPath: string) =>
  (dispatch, getState) => {
    const {system: {session: {access}}, orm: {story: {itemsById}}} = getState();
    if(access) {
      new StoryApi(access).blockUser(userPk)
        .then(({status}) => {
          if (Math.floor(status / 100) !== 4) {
            const blockList = Object.values(itemsById)
              .filter(({user}) => !!user && user.id === userPk)
              .map(item => item.id);
            dispatch(bulkDelStory(blockList));
            dispatch(deleteFeedList({[asPath]: blockList}));
          }
        });
    }
  };

export const increaseRetrieveCountThunk = (storyPk: HashId) => 
  (dispatch, getState) => {
    const {orm, system: {session: {access}}} = getState();
    const api = new StoryApi(access);
    const {retrieve_count} = pickStorySelector(storyPk)(orm);
    api.focus(storyPk)
      .then((res) => {
        if (res.status === 200) {
          dispatch(updateStory(
            storyPk,
            {retrieve_count: retrieve_count +1},
          ));
        }
      });
  }

export const increaseQnaUpCountThunk = (storyPk: HashId) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    const api = new StoryApi(access);
    api.qnaUp(storyPk)
      .then(({status}) => {
        if (Math.floor(status / 100) !== 4) {
          return dispatch(updateStory(
            storyPk,
            ({extension, ...curr}) =>
              ({
                ...curr,
                extension: {
                  ...extension,
                  up_count: extension.up_count + 1,
                },
              }),
            ));
        }
      });
  };

export const toggleApplyStatusThunk = (storyPk: HashId, applyPk: HashId, form: Indexable) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    const api = new StoryApi(access);
    api.patchApply(storyPk, applyPk, form)
      .then(({status}) => {
        if (Math.floor(status / 100) !== 4) {
          dispatch(updateStory(storyPk, curr => ({
            ...curr,
            applies: curr.applies.map(
              apply => apply.id === applyPk ? {...apply, ...form} : apply
            ),
          })));
        }
      });
  };

  export const errorOccuredStoryThunk = (storyPk: HashId, error: AxiosError) =>
    (dispatch) => {
      dispatch(updateStory(storyPk, {error}));
    };

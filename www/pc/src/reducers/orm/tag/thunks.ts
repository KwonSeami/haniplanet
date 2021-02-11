import {bulkSaveTag, updateTag} from './tagReducer';
import FeedApi from '../../../apis/FeedApi';
import {axiosInstance} from '@hanii/planet-apis';
import FollowApi from '../../../apis/FollowApi';
import {updateTagList} from './tagListReducer';
import moment from "moment";
import {LocalCache} from "browser-cache-storage";
import {BASE_URL} from '../../../constants/env';

export const followTag = (tagId: HashId, callback?: () => void) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();

    if (access) {
      new FollowApi(access).tag(tagId).then(({status}) => {
        if (Math.floor(status / 100) !== 4) {
          dispatch(updateTag(
            tagId,
            ({is_follow, ...rest}) => ({...rest, is_follow: !is_follow}),
          ));
          dispatch(updateTagList(
            'followed',
            (ids) => {
              if (ids.includes(tagId)) {
                return ids.filter(id => id !== tagId);
              } else {
                return [...ids, tagId];
              }
            }
          ));
          callback && callback();
        }
      });
    } else {
      alert('로그인 후 이용 가능합니다.');
    }
  };

export const fetchFeedTag = (uri?: string, params?: any) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    (uri
        ? axiosInstance({token: access, baseURL: BASE_URL}).get(uri)
        : new FeedApi(access).tag(params)
    ).then(({data: {results, ...kwargs}}) => {
      !!results && dispatch(bulkSaveTag(results, {...kwargs, listKey: 'feed',}));
    });
  };

export const fetchFollowedTag = (uri?: string) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    if (access) {
      (uri
          ? axiosInstance({token: access, baseURL: BASE_URL}).get(uri)
          : new FollowApi(access).tagList()
      ).then(({data: {results, ...kwargs}}) => {
        !!results && dispatch(bulkSaveTag(results, {...kwargs, listKey: 'followed',}));
      });
    } else {
      alert('로그인 후 이용 가능합니다.');
    }
  };


export const fetchExploreTag = (uri?: string) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    if (access) {
      const key = 'explore_tags';
      const uniqId = moment(new Date()).format('DD');
      const cached = LocalCache.get(uniqId, key);

      if(cached){
        dispatch(bulkSaveTag(cached, {...{}, listKey: 'explore',}));
      } else {
        (uri
            ? axiosInstance({token: access, baseURL: BASE_URL}).get(uri)
            : axiosInstance({token: access, baseURL: BASE_URL}).get('/explore/tag/')
        ).then(({data: {results, ...kwargs}}) => {
          if (!!results) {
            dispatch(bulkSaveTag(results, {...kwargs, listKey: 'explore',}));
            LocalCache.set(uniqId, key, results);
          }
        });
      }
    }
  };

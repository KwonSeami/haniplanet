import {axiosInstance} from '@hanii/planet-apis';
import UserApi from '../../../../apis/UserApi';
import FollowApi from '../../../../apis/FollowApi';
import {updateUser} from '../userReducer';
import {pickUserSelector} from '../selector';
import {BASE_URL} from '../../../../constants/env';
import {saveFollower, saveFollowing} from './userFollowReducer';

export const fetchUserFollower = (userPk: HashId) =>
  (dispatch, getState) => {
    const {
      system: {
        session: {access},
      },
      orm: {
          userFollowList: {
            sortByFollowee: {
              [userPk]: {
                rest: {next: uri},
              } = {rest: {}},
            },
          },
        },
    } = getState();
    (uri
        ? axiosInstance({token: access, baseURL: BASE_URL}).get(uri)
        : new UserApi(access).follower(userPk)
    ).then(({data: {results, ...rest}}) =>
      !!results && dispatch(saveFollower(userPk, results, rest)));
  };

export const fetchUserFollowing = (userPk: HashId) =>
  (dispatch, getState) => {
    const {
      system: {
        session: {access},
      },
      orm: {
          userFollowList: {
            sortByFollower: {
              [userPk]: {
                rest: {next: uri},
              } = {rest: {}},
            },
          },
        },
    } = getState();
    (uri
        ? axiosInstance({token: access, baseURL: BASE_URL}).get(uri)
        : new UserApi(access).following(userPk)
    ).then(({data: {results, ...rest}}) =>
      !!results && dispatch(saveFollowing(userPk, results, rest)));
  };

export const followUser = (userPk: HashId, callback?: () => void) =>
  (dispatch, getState) => {
    const {orm, system: {session: {access, id: myId}}} = getState();

    if (access) {
      new FollowApi(access)
        .user(userPk)
        .then(({data: {result}}) => {
          if (!!result) {
            const {is_follow} = result;
            // 나의 팔로잉 개수 수정
            dispatch(updateUser(
              myId,
              ({following_count, ...curr}) => ({
                ...curr,
                following_count: is_follow
                  ? following_count + 1
                  : following_count - 1,
              }),
            ));

            callback && callback();
            if (pickUserSelector(userPk)(orm)) {
              // 특정 유저의 팔로우 여부 업데이트
              dispatch(updateUser(
                userPk,
                ({is_follow: _, follower_count, ...curr}) => ({
                  ...curr,
                  is_follow,
                  follower_count: is_follow
                    ? follower_count + 1
                    : follower_count - 1,
                }),
              ));
            }
          }
        });
    } else {
      alert('로그인 후 이용 가능합니다.');
    }
  };

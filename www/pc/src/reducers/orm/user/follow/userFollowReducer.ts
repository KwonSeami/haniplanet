import {createActions, handleActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../../assets';
import {cloneDeep} from 'lodash';

export const {
  saveFollower,
  saveFollowing,
} = createActions({
  SAVE_FOLLOWER: (userPk: HashId, results: any[], rest = {}) =>
    ({userPk, results, rest}),
  SAVE_FOLLOWING: (userPk: HashId, results: any[], rest = {}) =>
    ({userPk, results, rest}),

});

const userFollowReducer = handleActions({
  [saveFollower.toString()]: (
    state,
    {payload: {userPk, results, rest}},
  ) => {
    const sortByFollowee = cloneDeep(state.sortByFollowee);
    const sortByFollower = cloneDeep(state.sortByFollower);
    const currUser = sortByFollowee[userPk] || {
      ids: [],
      rest,
    };
    const {ids: currUserIds} = currUser;
    results.forEach(model => {
      const {id: modelId} = model;
      if (!currUserIds.includes(modelId)) {
        currUserIds.push(modelId);
      }
      let follower = sortByFollower[modelId];
      if (!follower) {
        sortByFollower[modelId] = {
          ids: [],
          rest: {},
        };
        follower = sortByFollower[modelId];
      }
      if (!follower.ids.includes(userPk)) {
        follower.ids.push(userPk);
      }
    });

    currUser.rest = rest;
    sortByFollowee[userPk] = currUser;

    return {
      ...state,
      sortByFollowee,
      sortByFollower,
    };
  },
  [saveFollowing.toString()]: (
    state,
    {payload: {userPk, results, rest}},
  ) => {
    const sortByFollowee = cloneDeep(state.sortByFollowee);
    const sortByFollower = cloneDeep(state.sortByFollower);
    const currUser = sortByFollower[userPk] || {
      ids: [],
      rest,
    };
    const {ids: currUserIds} = currUser;
    results.forEach(model => {
      const {id: modelId} = model;
      if (!currUserIds.includes(modelId)) {
        currUserIds.push(modelId);
      }
      let followee = sortByFollowee[modelId];
      if (!followee) {
        sortByFollowee[modelId] = {
          ids: [],
          rest: {},
        };
        followee = sortByFollowee[modelId];
      }
      if (!followee.ids.includes(userPk)) {
        followee.ids.push(userPk);
      }
    });

    currUser.rest = rest;
    sortByFollower[userPk] = currUser;

    return {
      ...state,
      sortByFollowee,
      sortByFollower,
    };
  },
}, DEFAULT_ORM_STATE.userFollowList);

export default userFollowReducer;

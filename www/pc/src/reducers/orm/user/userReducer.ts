import {handleActions, createActions} from 'redux-actions';
import {bulkDeleteModel, bulkSaveModel, defaultActions, deleteModel, saveModel, updateModel} from '../utils';
import {DEFAULT_ORM_STATE} from '../assets';
import {saveFollower, saveFollowing} from './follow/userFollowReducer';
import cloneDeep from 'lodash/cloneDeep';

export const {
  updateUser,
  saveUser,
  delUser,
  bulkSaveUser,
  bulkDelUser,
} = defaultActions('user');

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

export const {userLogout, userLogin} = createActions({
  [USER_LOGOUT]: () => null,
  [USER_LOGIN]: payload => payload,
});
const userReducer = handleActions({
    [updateUser.toString()]: updateModel,
    [saveUser.toString()]: saveModel,
    [delUser.toString()]: deleteModel,
    [bulkSaveUser.toString()]: bulkSaveModel,
    [bulkDelUser.toString()]: bulkDeleteModel,
    [saveFollower.toString()]: bulkSaveModel,
    [saveFollowing.toString()]: bulkSaveModel,
    SAVE_FEED: (
      state,
      {payload: {results: models}},
    ) => {
      if (models) {
        const itemsById = cloneDeep(state.itemsById);

        models.forEach(({user}) => {
          if(!!user && !!user.name) {
            itemsById[user.id] = {
              ...itemsById[user.id],
              ...user,
            };
          }
        });

        return {...state, itemsById};
      }
      return state;
    },
  }, DEFAULT_ORM_STATE.user);

export default userReducer;


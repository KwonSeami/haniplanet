import {handleActions, createActions} from 'redux-actions';
import UserApi from '../apis/UserApi';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import {swapIdInArr} from '../lib/swap';

export const DEFAULT_PROFILE_STATE = {
  edu: {},
  brief: {},
  thesis: {},
  license: {},
  skill: {},
  tool: {}
};

export const SAVE_PROFILE = 'SAVE_PROFILE';
export const DELETE_PROFILE = 'DELETE_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const fetchProfileInfo = (userPk: HashId, name: TProfileFormName, callback?: () => void) =>
  (dispatch, getState) => {
    const {profile, system: {session: {access}}} = getState();
    const userApi = new UserApi(access);

    const userProfileInfo = profile[userPk] || DEFAULT_PROFILE_STATE;

    if (isEqual(userProfileInfo, DEFAULT_PROFILE_STATE) || isEmpty(userProfileInfo[name])) {
      userApi.getProfileAdditionalInfo(userPk, name)
        .then(({status, data: {results}}) => {
          if (status === 200 && !!results) {
            const ids = [];
            const data = {};

            results.forEach(v => {
              const {id} = v;

              ids.push(id);
              data[id] = v; 
            });

            dispatch(saveProfile({
              userPk,
              name,
              data: {
                ids,
                data
              }
            }));

            callback && callback();
          }
        });
    }
  };

export const appendProfileForm = <T>({name, form, userPk, callback}: {
  name: TProfileFormName,
  form: TProfileFormParamsExceptId<T>,
  userPk: HashId,
  callback?: () => void
}) =>
  (dispatch, getState) => {
    const {profile, system: {session: {access}}} = getState();
    const userApi = new UserApi(access);

    userApi.addProfileForm(name, userPk, form)
      .then(({status, data: {result}}) => {
        if (status === 201 && !!result) {
          const {ids, data} = profile[userPk][name];

          dispatch(saveProfile({
            userPk,
            name,
            data: {
              ids: [...ids, result.id],
              data: {
                ...data,
                [result.id]: result
              }
            }
          }));

          callback && callback();
        }
      });
  };

export const patchProfileForm = <T>({name, formId, form, userPk, callback}: {
  name: TProfileFormName,
  formId: HashId,
  form: TProfileFormParamsExceptId<T>,
  userPk: HashId,
  callback?: () => void
}) =>
  (dispatch, getState) => {
    const {profile, system: {session: {access}}} = getState();
    const userApi = new UserApi(access);

    const {data: currProfileData} = profile[userPk][name];

    userApi.editProfileForm(name, userPk, formId, form)
      .then(({status, data: {result}}) => {
        if (status === 200 && !!result) {
          dispatch(saveProfile({
            userPk,
            name,
            data: {
              data: {
                ...currProfileData,
                [formId]: result
              }
            }
          }));

          callback && callback();
        }
      });
  };

export const deleteProfileForm = ({name, userPk, formId, callback}: {
  name: TProfileFormName,
  userPk: HashId,
  formId: HashId,
  callback?: () => void
}) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    const userApi = new UserApi(access);

    userApi.deleteProfileForm(name, userPk, formId)
      .then(({status}) => {
        if (status === 200) {
          dispatch(deleteProfile({
            userPk,
            formId,
            name
          }));

          callback && callback();
        }
      });
  };

export const swapProfileForm = ({name, userPk, ids, currId, swapId, callback}: {
  name: Exclude<TProfileFormName, 'license' | 'skill' | 'tool'>,
  userPk: HashId,
  ids: HashId[],
  currId: HashId,
  swapId: HashId,
  callback?: () => void
}) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    const userApi = new UserApi(access);

    userApi.swapProfilFormOrder(name, currId, swapId)
      .then(({status}) => {
        if (status === 200) {
          const swappedDataIds = swapIdInArr(ids, currId, swapId);
          
          dispatch(saveProfile({
            userPk,
            name,
            data: {
              ids: swappedDataIds
            }
          }));

          callback && callback();
        }
      });
  };

export const {
  saveProfile,
  deleteProfile
} = createActions({
  [SAVE_PROFILE]: ({userPk, name, data}) => ({userPk, name, data}),
  [DELETE_PROFILE]: ({userPk, formId, name}) => ({userPk, formId, name})
});

const profile = handleActions(
  {
    [saveProfile.toString()]: (state, {payload: {userPk, name, data}}) => {
      const currProfileInfo = (state[userPk] || DEFAULT_PROFILE_STATE);

      return {
        ...state,
        [userPk]: {
          ...currProfileInfo,
          [name]: {
            ...currProfileInfo[name],
            ...data
          }
        }
      }
    },
    [deleteProfile.toString()]: (state, {payload: {userPk, formId, name}}) => {
      const {ids, data} = cloneDeep(state[userPk][name]);
      delete data[formId];

      return {
        ...state,
        [userPk]: {
          ...state[userPk],
          [name]: {
            ids: ids.filter(id => formId !== id),
            data
          }
        }
      };
    }
  },
  {}
);

export default profile;

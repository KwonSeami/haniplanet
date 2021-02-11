import {handleActions, createActions} from 'redux-actions';
import UserApi from '../apis/UserApi';
import isEmpty from 'lodash/isEmpty';
import {AxiosPromise} from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import BandApi from '../apis/BandApi';

export const SAVE_USER_HOSPITAL = 'SAVE_USER_HOSPITAL';
export const DELETE_USER_HOSPITAL = 'DELETE_USER_HOSPITAL';
export const UPDATE_USER_HOSPITAL = 'UPDATE_USER_HOSPITAL';

export const {saveUserHospital, deleteUserHospital, updateUserHospital} = createActions({
  [SAVE_USER_HOSPITAL]: ({userPk, data}) => ({userPk, data}),
  [DELETE_USER_HOSPITAL]: ({userPk, slug}) => ({userPk, slug}),
  [UPDATE_USER_HOSPITAL]: ({userPk, slug, data}) => ({userPk, slug, data})
});

export const fetchUserHospital = (userPk: HashId, api?: AxiosPromise, callback?: () => void) =>
  (dispatch, getState) => {
    const {hospital, system: {session: {access}}} = getState();

    if (isEmpty(hospital[userPk])) {
      const fetchAPI = api || new UserApi(access).hospital();

      fetchAPI.then(({status, data: {results}}) => {
        if (status === 200) {
          const hospitalInfo = {};

          results.forEach(data => {
            const {
              id,
              hospital,
              grade,
              position,
              subject_list,
              self_introduce
            } = data;

            hospitalInfo[hospital.slug] = {
              ...hospital,
              id,
              grade,
              position,
              subject_list,
              self_introduce
            };
          });

          dispatch(saveUserHospital({
            userPk,
            data: hospitalInfo
          }));
        }
      }).then(() => {
        callback && callback();
      })
    } else {
      callback && callback();
    }
  };

export const appendUserHospital = (slug: string, data: Indexable, callback?: () => void) =>
  (dispatch, getState) => {
    const {system: {session: {access, id: myId}}} = getState();
    const bandApi = new BandApi(access);

    bandApi.registerHospitalMember(slug, data)
      .then(({status, data}) => {
        if (status === 201) {
          const hospitalInfo = {};
          const {
            position,
            subject_list,
            self_introduce,
            id,
            band: {
              avatar,
              name,
              extension: {
                address,
                detail_address,
                telephone
              }
            }
          } = data;

          hospitalInfo[slug] = {
            slug,
            position,
            subject_list,
            self_introduce,
            id,
            address,
            avatar,
            name,
            detail_address,
            telephone
          };

          dispatch(saveUserHospital({
            userPk: myId,
            slug,
            data: hospitalInfo
          }));

          callback && callback();
        }
      });
  };

export const patchUserHospital = (slug: string, memberPk: HashId, data: Indexable, callback?: () => void) =>
  (dispatch, getState) => {
    const {system: {session: {access, id}}} = getState();
    const bandApi = new BandApi(access);

    bandApi.patchHospitalMember(slug, memberPk, data)
      .then(({status, data}) => {
        if (status === 200) {
          const {
            position,
            self_introduce,
            subject_list
          } = data;

          dispatch(updateUserHospital({
            userPk: id,
            slug,
            data: {
              position,
              self_introduce,
              subject_list
            }
          }));
  
          callback && callback();
        }
      });
  };

export const removeHospitalThunk = (slug: string, callback?: () => void) =>
  (dispatch, getState) => {
    const {hospital, system: {session: {access, id}}} = getState();
    const bandApi = new BandApi(access);

    bandApi.delete(slug)
      .then(({status}) => {
        if (status === 200) {
          const myHospital = hospital[id];

          if (!isEmpty(myHospital) && !isEmpty(myHospital[slug])) {
            dispatch(deleteUserHospital({
              userPk: id,
              slug
            }));
          }

          callback && callback();
        }
      });
  };

export const removeHospitalMemberThunk = (slug: string, memberPk: HashId, callback?: () => void) =>
  (dispatch, getState) => {
    const {system: {session: {access, id}}} = getState();
    const bandApi = new BandApi(access);

    bandApi.removeHospitalMember(slug, memberPk)
      .then(({status}) => {
        if (status === 204) {
          dispatch(deleteUserHospital({
            userPk: id,
            slug
          }));

          callback && callback();
        }
      });
  };

const hospital = handleActions(
  {
    [saveUserHospital.toString()]: (state, {payload: {userPk, data}}) => ({
      ...state,
      [userPk]: {
        ...state[userPk],
        ...data
      }
    }),
    [deleteUserHospital.toString()]: (state, {payload: {userPk, slug}}) => {
      const userHospital = cloneDeep(state[userPk]);
      delete userHospital[slug];

      return {
        ...state,
        [userPk]: userHospital
      };
    },
    [updateUserHospital.toString()]: (state, {payload: {userPk, slug, data}}) => ({
      ...state,
      [userPk]: {
        ...state[userPk],
        [slug]: {
          ...state[userPk][slug],
          ...data
        }
      }
    })
  },
  {}
);

export default hospital;

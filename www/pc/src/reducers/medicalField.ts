import {handleActions, createActions} from 'redux-actions';
import BandApi from '../apis/BandApi';
import isEmpty from 'lodash/isEmpty';
import {filterCategoryIcons, ICategoryIcons} from '../lib/hospital';

export const DEFAULT_MEDICAL_FIELD_STATE = {};

export const SAVE_MEDICAL_FIELD = 'SAVE_MEDICAL_FIELD';

export interface IMedicalFieldPayload {
  id: HashId;
  name: string;
  tags: string[];
  image: string;
  icons: ICategoryIcons[];
}

export const {saveMedicalField} = createActions({
  [SAVE_MEDICAL_FIELD]: (data: IMedicalFieldPayload[]) => data
});

export const fetchMedicalField = () =>
  (dispatch, getState) => {
    const {system: {session: {access}}, medicalField} = getState();
    const bandApi = new BandApi(access);

    if (isEmpty(medicalField)) {
      bandApi.category({
        band_type: 'hospital',
        has_children: 'true'
      }).then(({data: {results}}) => {
        const filteredMedicalField = results.reduce((prev, curr) => {
          const {
            id,
            name,
            avatar_off,
            children,
            icons,
          } = curr;

          const {
            normal,
            small,
            blue,
            white
          } = filterCategoryIcons(icons);

          prev[name] = {
            id,
            name,
            image: avatar_off,
            tags: children,
            icons: {
              normal,
              small,
              blue,
              white
            }
          };
          return prev;
        }, {});

        dispatch(saveMedicalField(filteredMedicalField));
      });
    }
  };

const medicalField = handleActions(
  {
    [saveMedicalField.toString()]: (state, {payload}: {payload: IMedicalFieldPayload[]}) => ({
      ...state,
      ...payload
    })
  },
  DEFAULT_MEDICAL_FIELD_STATE
);

export default medicalField;

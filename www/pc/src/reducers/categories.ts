import {createActions, handleActions} from 'redux-actions';
import ExploreApi from '../apis/ExploreApi';
import {MAIN_USER_TYPES} from '../constants/users';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import {HashId} from '@hanii/planet-types';

const SAVE_CATEGORIES = 'SAVE_CATEGORIES';

const DEFAULT_CATEGORY_IDS_BY_USER_TYPE = {
  default: [],
  doctor: [],
  student: []
};

export const DEFAULT_CATEGORIES_STATE = {
  categoriesById: {},
  categoryIdsByUserType: DEFAULT_CATEGORY_IDS_BY_USER_TYPE
};

export type TCommunityUserType = 'default' | 'doctor' | 'student';

export interface ICategoryItem {
  id?: string;
  name: string;
  new_stories_count?: number;
  user_type: TCommunityUserType;
}

export interface ICategoriesById {
  [key: HashId]: ICategoryItem[];
}

export interface ICategoryIdsByUserType {
  default: HashId[];
  doctor: HashId[];
  student: HashId[];
}

export interface ICategoriesPayload {
  categoriesById: ICategoriesById;
  categoryIdsByUserType: ICategoryIdsByUserType;
}

const {saveCategories} = createActions({
  [SAVE_CATEGORIES]: (payload) => payload
});

const categories = handleActions(
  {
    [saveCategories.toString()]: (state, {payload}) => ({
      ...state,
      ...payload
    })
  },
  DEFAULT_CATEGORIES_STATE
);

export const fetchCategoriesThunk = () => (dispatch, getState) => {
  const {categories: {categoriesById, categoryIdsByUserType}, system: {session: {access}}} = getState();

  if (isEmpty(categoriesById) && Object.values(categoryIdsByUserType).some(i => isEmpty(i))) {
    new ExploreApi(access).menu()
      .then(({data: {results}}) => {
        dispatch(saveCategories({
          categoriesById: results.reduce((prev, curr) => {
            const {new_stories_count, tag: {id, name}, user_types} = curr;

            return {
              ...prev,
              [id]: {
                name,
                new_stories_count,
                user_type: isEqual(user_types, MAIN_USER_TYPES) ? 'default' : user_types[0]
              }
            };
          }, {}),
          categoryIdsByUserType: results
            .sort((prev, curr) => prev.order - curr.order)
            .reduce((prev, curr) => {
              const {tag: {id}, user_types} = curr;

              prev[
                isEqual(user_types, MAIN_USER_TYPES) ? 'default' : user_types[0]
              ].push(id);

              return prev;
            }, DEFAULT_CATEGORY_IDS_BY_USER_TYPE)
        }));
      })
      .catch(error => console.error(error));
  }
};

export default categories;

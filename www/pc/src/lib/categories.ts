import isEmpty from 'lodash/isEmpty';
import {HashId} from '../../../../packages/types';
import {ICategoriesPayload, TCommunityUserType} from '../reducers/categories';
import {userTypeReverser} from './user';

// 모든 타입별 카테고리 항목의 존재 여부 반환
export const isCategoriesFetched = (categories: ICategoriesPayload) =>
  !(
    isEmpty(categories.categoriesById)
    || isEmpty(categories.categoryIdsByUserType.default)
    || isEmpty(categories.categoryIdsByUserType.doctor)
    || isEmpty(categories.categoryIdsByUserType.student)
  );

// 카테고리가 현재 user_type으로 접근가능한지 여부 반환
export const isCategoryAccessible = (
  categories: ICategoriesPayload,
  category: HashId,
  user_type: TCommunityUserType
) => categories.categoryIdsByUserType[userTypeReverser(user_type)].every(id => id !== category);

// 이름과 일치하는 카테고리의 키값을 반환
export const findCategoryIdsByName = (
  categories: ICategoriesPayload,
  name: string
) => {
  const {categoriesById} = categories;

  return Object.keys(categoriesById).filter(key => categoriesById[key].name === name);
};

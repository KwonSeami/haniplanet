import * as React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {POSITION_TYPES} from '../../../src/constants/profile';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export interface IJobFormState {
  position: TPosition;
  subject_list: TSubject[];
  self_introduce: string;
}

const useProfileJobForm = (initialData) => {
  const {me, id} = useSelector(
    ({orm, system: {session: {id}}}) => ({
      id,
      me: pickUserSelector(id)(orm) || {}
    }),
    shallowEqual
  );

  const {
    position,
    subject_list,
    self_introduce
  } = initialData || {} as IJobFormState;

  const [jobForm, setJobForm] = React.useState<IJobFormState>({
    position: position || POSITION_TYPES[0].value,
    subject_list: subject_list || [],
    self_introduce: self_introduce || ''
  });

  const isValidForm = React.useCallback((state: IJobFormState): [boolean, (string | IJobFormState)] => {
    const {subject_list, self_introduce} = state;

    if (isEmpty(subject_list)) {
      return [false, '진료분야를 선택해주세요!'];
    }

    if (!self_introduce) {
      return [false, '인사말을 입력해주세요!'];
    }

    return [true, state];
  }, []);

  const patchForm = React.useCallback((initialState: IJobFormState, currentState: IJobFormState): Partial<IJobFormState> => {
    if (isEqual(initialState, currentState)) {
      return {};
    }

    const form = {};

    Object.keys(initialState).forEach(key => {
      const initialValue = initialState[key];
      const currentValue = currentState[key];

      if (initialValue !== currentValue || !isEqual(initialValue, currentValue)) {
        form[key] = currentValue;
      }
    });

    return form;
  }, []);

  return {
    me,
    id,
    jobForm,
    setJobForm,
    isValidForm,
    patchForm
  };
};

export default useProfileJobForm;

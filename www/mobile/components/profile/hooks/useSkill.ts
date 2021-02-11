import * as React from 'react';
import isEqual from 'lodash/isEqual';
import ProfileApi from '../../../src/apis/ProfileApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {useDispatch, useSelector} from 'react-redux';
import {saveSkill} from '../../../src/reducers/skill';
import {RootState} from '../../../src/reducers';
import isEmpty from 'lodash/isEmpty';

const useSkill = () => {
  const dispatch = useDispatch();
  const skill = useSelector(
    ({skill}: RootState) => skill,
    (prev, curr) => isEqual(prev, curr)
  );

  const profileApi: ProfileApi = useCallAccessFunc(access => new ProfileApi(access));

  const fetchFieldAndDetail = React.useCallback(() => {
    profileApi.skillField().then(({data: {result: field}}) =>
      !!field && profileApi.skillDetail().then(({data: {result: detail}}) => {
        !!detail && dispatch(saveSkill({field, detail}));
      }));
  }, []);

  React.useEffect(() => {
    if (isEmpty(skill)) {
      fetchFieldAndDetail();
    }
  }, [skill, fetchFieldAndDetail]);

  return skill;
};

export default useSkill;

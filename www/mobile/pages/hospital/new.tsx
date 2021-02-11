import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {useSelector,shallowEqual} from 'react-redux';
import Page403 from '../../components/errors/Page403';
import Loading from '../../components/common/Loading';
import HospitalRegister from '../../components/hospital/HospitalRegister';
import loginRequired from '../../hocs/loginRequired';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {RootState} from '../../src/reducers';

const HospitalNew = React.memo(() => {
  const me = useSelector(
    ({orm, system : {session :{id}}}: RootState) => pickUserSelector(id)(orm),
    shallowEqual,
  );

  if (isEmpty(me)) {
    return <Loading />;
  } else if (me.user_type !== 'doctor') {
    return <Page403 />;
  }
  
  return (
    <HospitalRegister type="ADD" />
  );
});

export default loginRequired(HospitalNew);

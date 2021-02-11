import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {useSelector,shallowEqual} from 'react-redux';
import Loading from '../../components/common/Loading';
import Page403 from '../../components/errors/Page403';
import HospitalRegister from '../../components/hospital/register/HospitalRegister';
import loginRequired from '../../hocs/loginRequired';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {RootState} from '../../src/reducers';
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';

const NewHospitalPage = React.memo(() => {
  // Redux
  const me = useSelector(
    ({orm, system: {session : {id}}}: RootState) => pickUserSelector(id)(orm),
    shallowEqual,
  );

  // Custom Hooks
  useSetPageNavigation('/hospital');

  if (isEmpty(me)) {
    return <Loading />;
  } else if (me.user_type !== 'doctor') {
    return <Page403 />;
  }

  return (
    <HospitalRegister />
  );
});

export default loginRequired(NewHospitalPage);
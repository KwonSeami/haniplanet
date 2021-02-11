import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../src/reducers/orm/user/selector';
import Page403 from '../components/errors/Page403';
import isEmpty from 'lodash/isEmpty';
import Loading from '../components/common/Loading';
import {RootState} from '../src/reducers';

const doctorRequired = (Target: React.ComponentType) => {
  const DoctorRequired = (props) => {
    const me = useSelector(
      ({orm, system: {session: {id}}}: RootState) => pickUserSelector(id)(orm),
      shallowEqual
    );

    return isEmpty(me) ? (
      <Loading/>
    ) : me.user_type === 'doctor' ? (
      <Target {...props}/>
    ) : (
      <Page403/>
    );
  };

  DoctorRequired.displayName = 'DoctorRequired';
  DoctorRequired.getInitialProps = Target.getInitialProps;

  return DoctorRequired;
};

export default doctorRequired;

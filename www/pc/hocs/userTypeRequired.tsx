import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../src/reducers/orm/user/selector';
import Page403 from '../components/errors/Page403';
import isEmpty from 'lodash/isEmpty';
import Loading from '../components/common/Loading';
import {RootState} from '../src/reducers';

const userTypeRequired = (Target: React.ComponentType, userTypes: any[]) => {
  const UserTypeRequired = (props) => {
    const me = useSelector(
      ({orm, system: {session: {id}}}: RootState) => pickUserSelector(id)(orm),
      shallowEqual
    );

    return isEmpty(me) ? (
      <Loading/>
    ) : userTypes.includes(me.user_type) ? (
      <Target {...props}/>
  ) : (
      <Page403/>
    );
  };

  UserTypeRequired.displayName = 'UserTypeRequired';
  UserTypeRequired.getInitialProps = Target.getInitialProps;

  return UserTypeRequired;
};

export default userTypeRequired;

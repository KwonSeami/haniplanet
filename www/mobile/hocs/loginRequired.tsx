import * as React from 'react';
import {useSelector} from 'react-redux';
import Page401 from '../components/errors/Page401';

const loginRequired = (Target: React.ComponentType<any>) => {
  const LoginRequired = (props) => {
    const {access} = useSelector(({system: {session: {access}}}) => ({
      access
    }));

    return !access ? (
      <Page401/>
    ) : (
      <Target {...props}/>
    );
  };
  LoginRequired.displayName = 'LoginRequired';
  LoginRequired.getInitialProps = Target.getInitialProps;
  return LoginRequired;
};

export default loginRequired;

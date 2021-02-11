import * as React from 'react';
import {useSelector} from 'react-redux';
import Page400 from "../components/errors/Page400";

const anonRequired = (Target: React.ComponentType) => {

  const AnonRequired = (props) => {
    const {access} = useSelector(({system: {session: {access}}}) => ({
      access
    }));

    return !access ? (
      <Target {...props}/>
    ) : (
      <Page400 />
    );
  };
  AnonRequired.displayName = 'AnonRequired';
  AnonRequired.getInitialProps = Target.getInitialProps;
  return AnonRequired;
};

export default anonRequired;

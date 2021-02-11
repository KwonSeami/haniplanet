import * as React from 'react';
import {useSelector} from 'react-redux';
import Page401 from '../components/errors/Page401';
import Page403 from "../components/errors/Page403";
import { pickUserSelector } from "../src/reducers/orm/user/selector";

const adminRequired = (Target: React.ComponentType) => {
  const AdminRequired = (props) => {
    const {access, is_admin} = useSelector(({orm, system: {session: {id, access}}}) => ({
      access,
      is_admin: pickUserSelector(id)(orm)?.is_admin,
    }));

    return !access || !is_admin ? (
      <Page403/>
    ) : (
      <Target {...props}/>
    );
  };

  AdminRequired.displayName = 'AdminRequired';
  AdminRequired.getInitialProps = Target.getInitialProps;
  return AdminRequired;
};

export default adminRequired;

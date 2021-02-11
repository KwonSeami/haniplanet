import * as React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import ConsultantPC from '../../components/band/consultant/index.pc';
import Loading from '../../components/common/Loading';
import MoaMain from '../../components/moa/index.pc';
import loginRequired from '../../hocs/loginRequired';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {RootState} from '../../src/reducers';
import userTypeRequired from "../../hocs/userTypeRequired";

const BandList = React.memo(() => {
  const {user: {user_type}} = useSelector(
    ({system, orm}: RootState) => ({
      user: pickUserSelector(system.session.id)(orm) || {} as any,
    }),
    shallowEqual
  );

  const DetailComp = React.useMemo(() => {
    if (!user_type) {
      return Loading;
    }

    switch (user_type) {
      case 'consultant':
        return ConsultantPC;
      default:
        return MoaMain;
    }
  }, [user_type]);

  if (!DetailComp) {
    return <Loading />;
  }

  return (
    <DetailComp/>
  );
});

BandList.displayName = 'BandList';

export default loginRequired(
  userTypeRequired(
    BandList,
    ['doctor', 'student']
  )
);


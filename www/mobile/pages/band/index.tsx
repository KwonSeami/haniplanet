import * as React from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import ConsultantMobile from '../../components/moa/consultant/index.mobile';
import Loading from '../../components/common/Loading';
import MoaMainMobile from '../../components/moa/index.mobile';
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
        return ConsultantMobile;
      default:
        return MoaMainMobile;
    }
  }, [user_type]);

  if (!DetailComp) {
    return <Loading/>;
  }

  return (
    <DetailComp/>
  );
});

BandList.displayName = 'BandList';

export default loginRequired(
  userTypeRequired(
    React.memo(BandList),
    ['doctor', 'student']
  )
);

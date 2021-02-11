import * as React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import Loading from '../../components/common/Loading';
import loginRequired from '../../hocs/loginRequired';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {RootState} from '../../src/reducers';
import OnClassMain from '../../components/onClass/OnClassMain';
import Page404 from '../../components/errors/Page404';
import userTypeRequired from '../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../src/constants/users';

const OnClassPage = () => {
  const {user_type} = useSelector(
    ({system, orm}: RootState) => pickUserSelector(system.session.id)(orm) || {} as any,
    shallowEqual,
  );

  const DetailComp = React.useMemo(() => {
    if (!user_type) {
      return null;
    }

    switch (user_type) {
      case 'consultant':
        return Page404;
      default:
        return OnClassMain;
    }
  }, [user_type]);

  if (!DetailComp) {
    return <Loading />;
  }

  return (
    <DetailComp/>
  );
};

OnClassPage.displayName = 'OnClassPage';
export default loginRequired(
  userTypeRequired(
    React.memo(OnClassPage),
    [...MAIN_USER_TYPES, 'hani']
  )
);

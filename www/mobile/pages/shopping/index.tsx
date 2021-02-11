import * as React from 'react';
import loginRequired from '../../hocs/loginRequired';
import OpenShopping from '../../components/common/OpenShopping';

const Shopping: React.FC = () => {
 
  return <OpenShopping/>
};

Shopping.displayName = 'Shopping';
export default loginRequired(React.memo(Shopping));

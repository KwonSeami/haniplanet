import * as React from 'react';
import loginRequired from '../../../hocs/loginRequired';
import OpenShopping from '../../../components/common/OpenShopping';

const ShoppingDetail = () => {
 
  return <OpenShopping/>
};

ShoppingDetail.displayName = 'ShoppingDetail';
export default React.memo(loginRequired(ShoppingDetail));

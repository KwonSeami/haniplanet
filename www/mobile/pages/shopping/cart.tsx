import * as React from 'react';
import loginRequired from '../../hocs/loginRequired';
import OpenShopping from '../../components/common/OpenShopping';

const Cart = () => {
  
  return <OpenShopping/>
};

Cart.displayName = 'Cart';
export default loginRequired(React.memo(Cart));

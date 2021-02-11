import * as React from 'react';
import {ApolloProvider} from '@apollo/react-components';
import AddressPopup from './AddressPopup';
import apolloClient from '../../../src/lib/apollo/apolloClient';

const ApolloAddressPopup: React.FC = (props) => (
  <ApolloProvider client={apolloClient()}>
    <AddressPopup {...props}/>
  </ApolloProvider>
);

ApolloAddressPopup.displayName = 'ApolloAddressPopup';
export default ApolloAddressPopup;
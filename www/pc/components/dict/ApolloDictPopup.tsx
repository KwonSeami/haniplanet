import * as React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import DictPopup from './DictPopup';
import apolloClient from '../../src/lib/apollo/apolloClient';

const ApolloDictPopup = React.memo(props => (
  <ApolloProvider client={apolloClient()}>
    <DictPopup {...props} />
  </ApolloProvider>
));

export default ApolloDictPopup;
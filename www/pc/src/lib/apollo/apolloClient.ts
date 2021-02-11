import {ApolloClient} from 'apollo-client';
import {ApolloLink, Observable} from 'apollo-link';
import {onError} from 'apollo-link-error';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {GRAPHQL_BASE_URL} from '../../constants/env';
import Cookies from "js-cookie";

const request = async (operation) => {
  const access = Cookies.get('access');

  operation.setContext({
    headers: {Authorization: `Bearer ${access}`},
  });
};

const requestLink = () => new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

const apolloClient = () => new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
        );
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    }),
    requestLink(),
    new HttpLink({
      uri: GRAPHQL_BASE_URL,
      credentials: 'same-origin'
    })
  ]),
  cache: new InMemoryCache(),
});

export default apolloClient;
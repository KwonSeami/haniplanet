import * as React from 'react';
import Router, {useRouter} from 'next/router';

const Meetup = React.memo(() => {
  // Router
  const {query} = useRouter();

  React.useEffect(() => {
    Router.push({pathname: '/user/me/meetup', query});
  }, [query]);

  return null;
});

export default React.memo(Meetup);
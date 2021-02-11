import * as React from 'react';
import Loading from '../components/common/Loading';

const lazyRenderHOC = (Target: any, time: number = 1000) => {
  const LazyRender = React.memo(props => {
    const [render, setRender] = React.useState(false);

    React.useEffect(() => {
      setTimeout(() => setRender(true), time);
    }, [time]);

    return render ? (<Target {...props} />) : <Loading />;
  });

  LazyRender.displayName = 'LazyRender';
  return LazyRender;
};
export default lazyRenderHOC;

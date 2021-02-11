import '@babel/polyfill';
// import 'core-js/es6/map';
// import 'core-js/es6/set';
// import 'core-js/es6/symbol';
// import 'raf/polyfill';
import React from 'react';
import * as ReactDOM from 'react-dom';
// import './polyfills';
import PcRoot from './PcRoot';
import configureStore, {INITIAL_STATE} from './store.config';
import * as Cookies from 'js-cookie';

console.log(process.env.NODE_ENV);


// runRaven(
//     () => Sentry.init({ dsn: 'https://96afe0c9098b4261ba47d8029ccc9bf5@sentry.io/1280057' }),
//     // () => Sentry.setExtraContext({executeContext: process.env.NODE_ENV}),
//     () => console.log('%cBalky', 'font-size:80px;color:#0bb71e;font-weight:bold;font-family:sans-serif',),
//     () => console.log('%cVisit us! %chttps://balky.kr', 'font-size:20px;color:#000', 'font-size:20px;color:blue'),
// );
// Sentry.configureScope((scope) => {
// scope.setTag("page_locale", "de-at");
// scope.setLevel('warning');
// scope.setUser({"email": "john.doe@example.com"});
// });
ReactDOM.hydrate(
  <PcRoot
    store={configureStore({
      // 변경해야할 경우,  MobileRoot 도 같이 업데이트 해야함
      ...INITIAL_STATE,
      system: {
        ...INITIAL_STATE.system,
        session: {
          ...INITIAL_STATE.system.session,
          access: Cookies.get('access'),
          refresh: Cookies.get('refresh'),
        },
      },
    })}
  />
  , document.querySelector('#appRoot'),
);


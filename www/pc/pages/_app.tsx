import * as React from 'react';
import * as Sentry from '@sentry/browser';
import isEqual from 'lodash/isEqual';
import App from 'next/app';
import withRedux from 'next-redux-wrapper'
import 'isomorphic-fetch';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import {Provider, shallowEqual, useDispatch, useSelector} from 'react-redux';
import {toastReducerThunks} from '@hanii/toast-renderer';
import BaseStyles from '../styles/base.types';
import FontStyles from '../styles/fonts.styles';
import CommonStyle from '../styles/common.styles';
import EditorStyle from '../styles/editor.styles';
import RendererStyle from '../styles/renderer.styles';
import Footer from '../components/layout/footer';
import HeaderPC from '../components/layout/header/HeaderPC';
import {fetchRefreshToken} from '../src/reducers/system/session/sessionReducer';
import PopupRenderer from '../components/common/popup/PopupRenderer';
import withTracker from '../components/withTracker';
import {BASE_SOCKET_URL, IS_PROD_SERVER, SENTRY_TRACKING_ID, SITE_TITLE} from '../src/constants/env';
import {isMobile} from '../src/lib/device';
import OGMetaHead from '../components/OGMetaHead';
import StyledToastRenderer from '../styles/StyledToastRenderer';
import ToastRendererItem from '../components/ToastAlarm/ToastRendererItem';
import {updateUser} from '../src/reducers/orm/user/userReducer';
import {ApolloProvider} from '@apollo/react-hooks';
import apolloClient from '../src/lib/apollo/apolloClient';
import {clearSessionThunk} from "../src/reducers/system/session/thunks";
import configureStore from "../store.config";
import TokenRefresher from "../components/session/TokenRefresher";
import TokenChangeObserver from "../components/session/TokenChangeObserver";
import DayPickerStyle from "../styles/daypicker";
import ImagePopupRenderer from '../components/layout/popup/ImagePopup/ImagePopupRenderer';
import ErrorBoundary from '../components/common/ErrorBoundary';
import '../styles/editor.css';

const {intervalPopToastAlarm} = toastReducerThunks;

const SocketConnector = React.memo(() => {
  const [socket, setSocket] = React.useState(null);
  const dispatch = useDispatch();
  const {access, id: myId} = useSelector(
    ({toast, system: {session: {access, id}}}) => ({
      id,
      access,
      toast: toast?.alarm || [],
    }),
    shallowEqual,
  );

  React.useEffect(() => {
    // if (access && myId && !socket) {
    //   const _socket = new WebSocket(`${BASE_SOCKET_URL}/ws/alarm/?${access}`);
    //   _socket.onmessage = function (e) {
    //     const toastAlarm = (typeof(e.data) === 'string') ? JSON.parse(e.data) : e.data;
    //     const {type, payload} = toastAlarm;
    //
    //     dispatch(updateUser(myId, ({alarm_count, ...curr}) => ({
    //       ...curr,
    //       alarm_count: alarm_count + 1,
    //     })));
    //     dispatch(intervalPopToastAlarm({
    //       type,
    //       toastType: 'alarm',
    //       alarmId:`alarm-${toastAlarm.payload.id}-${Date.now()}`,
    //       ...payload,
    //     }, 5000));
    //   };
    //   _socket.onclose = () => setSocket(null);
    //   setSocket(_socket);
    // }
  }, [access, socket, myId]);

  return null;
});

if (IS_PROD_SERVER) {
  Sentry.init({
    dsn: SENTRY_TRACKING_ID,
    release: process.env.npm_package_version,
    maxBreadcrumbs: 50,
    attachStacktrace: true,
    beforeSend(event) {
      const {exception: {values}} = event;

      if (values[0].value.includes('WRM') || values[0].value.includes('wcs_do')) {
        return null;
      }
      return event;
    }
  });
}

// Router.events.on('routeChangeComplete', () => {
//   const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
//   const timestamp = new Date().valueOf();
//   els[0].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
// });

const TOAST_ALARM_COUNT = 5;
const HIDE_HEADER_LIST = [
  '/onclass/[slug]/lecture/[id]',
  '/login'
];
const HIDE_FOOTER_LIST = [
  '/band/[slug]',
  '/modunawa',
  '/newest',
  '/professor',
  '/tag/[id]',
  '/user/[id]',
  '/hospital/search',
  '/onclass/[slug]/lecture/[id]',
];

class MyApp extends App {
  public static displayName = 'App';

  constructor(props) {
    super(props);
    this.state = {
      tokenPending: true,
      Tracked: withTracker(props.Component),
    };
  }

  componentDidMount(): void {
    if (isMobile() && (window.location.host === 'www.haniplanet.com' || window.location.host === 'www.huplanet.kr')) {
      const url = `https://mobile.haniplanet.com${window.location.pathname}${window.location.search}`;
      window.location.href = url;
    }
  }

  componentDidUpdate(prevProps) {
    const {Component: prevComponent} = prevProps;
    const {Component: currComponent} = this.props;

    if (currComponent && !isEqual(prevComponent, currComponent)) {
      this.setState({
        Tracked: withTracker(currComponent),
      });
    }
  }

  callbackTokenRefresh = (refresh) => {
    const {store: {dispatch}} = this.props;

    if (refresh) {
      dispatch(fetchRefreshToken({
        refresh,
        callback: () => this.setState({tokenPending: false}),
      }));
    } else {
      dispatch(clearSessionThunk());
      this.setState({tokenPending: false});
    }
  };

  public render() {
    const {Tracked} = this.state;
    const {Component, pageProps, store, router: {pathname}} = this.props;

    const hideHeader = HIDE_HEADER_LIST.includes(pathname);
    const hideFooter = HIDE_FOOTER_LIST.includes(pathname);

    return (
      <Provider store={store}>
        <OGMetaHead title={SITE_TITLE}/>
        <BaseStyles/>
        <FontStyles/>
        <CommonStyle/>
        <EditorStyle/>
        <RendererStyle/>
        <DayPickerStyle/>

        {this.state.tokenPending ? (
          <TokenRefresher
            callback={this.callbackTokenRefresh}
          />
        ) : (
          <>
            {!hideHeader && <HeaderPC/>}
            {/*{Component.getInitialProps ? (*/}
            {/*  <Tracked pageProps={pageProps}/>*/}
            {/*) : !this.state.tokenPending && (*/}
            {/*  <ApolloProvider client={apolloClient()}>*/}
            {/*    <Tracked pageProps={pageProps} />*/}
            {/*  </ApolloProvider>*/}
            {/*)}*/}
            {!this.state.tokenPending && (
              <ApolloProvider client={apolloClient()}>
                <Tracked pageProps={pageProps} />
              </ApolloProvider>
            )}
            {!hideFooter && (
              <Footer/>
            )}
            <SocketConnector />
            <PopupRenderer/>
            <ErrorBoundary>
              <StyledToastRenderer
                count={TOAST_ALARM_COUNT}
                Item={ToastRendererItem}
                toastType='alarm'
              />
            </ErrorBoundary>
            <ImagePopupRenderer />
            <TokenChangeObserver />
          </>
        )}
      </Provider>
    );
  }
}

export default withRedux(configureStore)(MyApp);

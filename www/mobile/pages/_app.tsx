import * as React from 'react';
import 'isomorphic-fetch';
import isEqual from 'lodash/isEqual';
import App from 'next/app';
import withRedux from 'next-redux-wrapper'
import {Provider} from 'react-redux';
import BaseStyles from '../styles/base.types';
import FontStyles from '../styles/fonts.styles';
import CommonStyles from '../styles/common.styles';
import EditorStyle from '../styles/editor.styles';
import RendererStyle from '../styles/renderer.styles';
import PopupRenderer from '../components/common/popup/PopupRenderer';
import FooterMobile from '../components/layout/footer/FooterMobile';
import HeaderMobile from '../components/layout/header/HeaderMobile';
import withTracker from '../components/withTracker';
import {IS_PROD_SERVER, SENTRY_TRACKING_ID, SITE_TITLE} from '../src/constants/env';
import * as Sentry from '@sentry/browser';
import OGMetaHead from '../components/OGMetaHead';
import {ApolloProvider} from '@apollo/react-hooks';
import apolloClient from '../src/lib/apollo/apolloClient';
import configureStore from '../store.config';
import TokenRefresher from "../components/session/TokenRefresher";
import {fetchRefreshToken} from '../src/reducers/system/session/sessionReducer';
import {clearSessionThunk} from '../src/reducers/system/session/thunks';
import TokenChangeObserver from '../components/session/TokenChangeObserver';
import ImagePopupRenderer from '../components/layout/popup/ImagePopup/ImagePopupRenderer';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import '../styles/editor.css';

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

class MyApp extends App {
  public static displayName = 'App';

  constructor(props) {
    super(props);
    this.state = {
      tokenPending: true,
      Tracked: withTracker(props.Component),
    };
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

    return (
      <Provider store={store}>
        <OGMetaHead title={SITE_TITLE}/>
        <BaseStyles/>
        <FontStyles/>
        <CommonStyles/>
        <EditorStyle/>
        <RendererStyle/>

        {this.state.tokenPending ? (
          <TokenRefresher
            callback={this.callbackTokenRefresh}
          />
        ) : (
          <>
            <HeaderMobile/>
            {!this.state.tokenPending && (
              <ApolloProvider client={apolloClient()}>
                <Tracked pageProps={pageProps}/>
              </ApolloProvider>
            )}
            {/*{Component.getInitialProps ? (*/}
            {/*  <Tracked pageProps={pageProps}/>*/}
            {/*) : !this.state.tokenPending && (*/}
            {/*  <ApolloProvider client={apolloClient()}>*/}
            {/*    <Tracked pageProps={pageProps}/>*/}
            {/*  </ApolloProvider>*/}
            {/*)}*/}
            <FooterMobile/>
            <PopupRenderer/>
            <ImagePopupRenderer />
            <TokenChangeObserver/>
          </>
        )}
      </Provider>
    );
  }
}

export default withRedux(configureStore)(MyApp);

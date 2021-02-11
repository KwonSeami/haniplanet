import * as React from 'react';
import * as ReactGA from 'react-ga';
import {connect} from 'react-redux';
import Head from 'next/head';
import {RootState} from "../src/reducers";
import {
  CHANNEL_TALK_PLUGIN_KEY,
  DEV,
  GA_TRACKING_ID,
  GOOGLE_ADS_ID,
  IS_PROD_SERVER
} from "../src/constants/env";
import v4 from "uuid/v4";
import {LocalCache} from "browser-cache-storage";
import {DAY} from "../src/constants/times";
import jwt_decode from 'jwt-decode';

const withTracker = (Target: any, options = {}) => {
  const trackPage = (page: string) => {
    if (IS_PROD_SERVER) {
      ReactGA.set({
        page,
        ...options,
        debug: !IS_PROD_SERVER,
        testMode: !IS_PROD_SERVER,
      });
      ReactGA.pageview(page);
    }
  };

  interface Props {
    id: Id;
  }

  const mapStateToProps = ({system: {session: {access, id}}, orm: {user: {itemsById}}}: RootState) => ({
    id,
    access,
    user: itemsById[id] || {pending: true}
  });

  const getLocalUUID = (defaultUserId: string) => {
    if (defaultUserId) {
      try {
        const {uid} = jwt_decode(defaultUserId);
        return uid;
      } catch(err) {
        // pass
      }

    }
    const UID_KEY = 'channeltalk';
    const localUuid = LocalCache.get('???', UID_KEY, DAY);
    if (localUuid) {
      return localUuid.uuid;
    }
    const uuid = v4();
    LocalCache.set('???', UID_KEY, {uuid});

    return uuid;
  };

  class TrackingHOC extends React.Component<Props, {}> {
    public currLoc: string;

    constructor(props: Props) {
      super(props);
      if (IS_PROD_SERVER) {
        ReactGA.initialize([
          {
            trackingId: GA_TRACKING_ID,
            debug: DEV,
            testMode: DEV,
            gaOptions: {
              userId: String(this.props.id),
            },
          },
          {
            trackingId: GOOGLE_ADS_ID,
            debug: DEV,
            testMode: DEV,
          }
        ]);
      }
    }

    public track = () => {
      if (typeof window !== 'undefined') {
        const {pathname, search} = window.location;
        trackPage(pathname +search);
        this.currLoc = pathname + search;
      } else {
        setTimeout(this.track, 500);
      }
    };

    public componentDidMount() {
      this.track();
    }

    public componentDidUpdate(): void {
      if (typeof window !== 'undefined') {
        const {pathname, search} = window.location;
        if (this.currLoc !== pathname + search) {
          this.track();
        }
      }
    }

    public render() {
      const {access, id, pageProps: {hideTalk}, user: {name = '', auth_id = '', phone = '', email = ''}} = this.props;

      return (
        <>
          {IS_PROD_SERVER && (
            <Head>
              {/*<!-- Global site tag (gtag.js) - Google Ads: 795712204 -->*/}
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}/>
              <script>{`
                         window.dataLayer = window.dataLayer || []; 
                         function gtag(){dataLayer.push(arguments);}
                         gtag('js', new Date()); 
                         gtag('config', '${GOOGLE_ADS_ID}'); 
                        `}
              </script>
              {!hideTalk && (
                <script>{`
                  (function() {
                  var w = window;
                  if (w.ChannelIO) {
                    return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');
                  }
                  var d = window.document;
                  var ch = function() {
                    ch.c(arguments);
                  };
                  ch.q = [];
                  ch.c = function(args) {
                    ch.q.push(args);
                  };
                  w.ChannelIO = ch;
                  function l() {
                    if (w.ChannelIOInitialized) {
                      return;
                    }
                    w.ChannelIOInitialized = true;
                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
                    s.charset = 'UTF-8';
                    var x = document.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);
                  }
                  if (document.readyState === 'complete') {
                    l();
                  } else if (window.attachEvent) {
                    window.attachEvent('onload', l);
                  } else {
                    window.addEventListener('DOMContentLoaded', l, false);
                    window.addEventListener('load', l, false);
                  }
                  })();
                ChannelIO('shutdown');
                ChannelIO('boot', {
                    "pluginKey": "${CHANNEL_TALK_PLUGIN_KEY}", //please fill with your plugin key
                    "userId": "${getLocalUUID(access)}", //fill with user id
                    "profile": {
                      "name": "${name}", //fill with user name
                      "mobileNumber": "${phone}", //fill with user phone number
                      "email": "${email}",
                      "auth_id": "${auth_id}",
                      "id": "${id}",
                    }
                });
              `}</script>
              )}
              <script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script>
              <script type="text/javascript">{`
                if(!wcs_add) var wcs_add = {};
                wcs_add["wa"] = "d687557a17735";
                wcs_do();
              `}</script>
            </Head>
          )}
          <Target {...this.props} />
        </>
      );
    }
  }

  return connect(mapStateToProps)(TrackingHOC);
};

export default withTracker;

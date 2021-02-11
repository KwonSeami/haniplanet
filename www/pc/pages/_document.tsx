import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Document, {DocumentContext, Head, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from 'styled-components';
import {FB_TRACKING_ID} from '../src/constants/env';
import React from "react";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  public render() {
    // const {styles} = this.props;
    return (
      <html lang="ko">
      <Head>
        <link rel="icon" href="/static/favicon.ico" type="image/x-icon"/>
        <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon"/>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,600,800&display=swap" rel="stylesheet"/>
        <meta name="google-site-verification" content="iihd07AzQ20pwS1WVLE6ZNtr3ZUWT_lkmzpDLs-TVCE"/>
        <meta name="naver-site-verification" content="1b0baa140e9aa90c05a439c0beb0ff45a177509c"/>
        {/*<!--[if lt IE 10]>*/}
        {/*<script*/}
        {/*src="https://cdnjs.clo*/}
        {/*udflare.com/ajax/libs/html5shiv/3.7.3/html5shiv-printshiv.min.js">*/}
        {/*</script>*/}
        {/*<script>alert('인터넷 익스플로러9 이하를 이용하시면 한의플래닛의 기능 사용에 제한이 있을 수 있습니다.*/}
        {/*인터넷 익스플로러11 또는 크롬을 이용해주세요'); </script>*/}
        {/*<![endif]-->*/}
        {/*<!-- Facebook Pixel Code -->*/}
        <noscript>
          <img
            height="1"
            width="1"
            style={{
              display: 'none',
            }}
            src={`https://www.facebook.com/tr?id=${FB_TRACKING_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        {/*<!-- End Facebook Pixel Code -->*/}
        <meta
          name="viewport"
          content="
                width=device-width,
                initial-scale=1.0,
                minimum-scale=1.0,
                maximum-scale=1.0,
                user-scalable=no
            "
        />
        {/* react slick css import */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <script
          type="text/javascript"
          src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=83kvp4b50e"
        />
        {/*{styles}*/}

        <script
          dangerouslySetInnerHTML={{
            __html: `window.__VERSION__ = ${process.env.npm_package_version};`,
          }}
        />
        {/* <!-- BEGIN 아임포트 모듈--> */}
        <script type="text/javascript" src="//code.jquery.com/jquery-1.12.4.min.js"/>
        <script type="text/javascript" src="//service.iamport.kr/js/iamport.payment-1.1.5.js"/>
        {/*<!-- END 아임포트 모듈-->*/}
        <meta name="viewport" content="width=device-width, user-scalable=no"/>
        {/*<link rel="stylesheet" type="text/css" href={'/_next/static/css/styles.chunk.css?v=' + Date.now()} />*/}
      </Head>
      <body>
      <div id="appRoot">
        <Main/>
      </div>
      <div id="popup"/>
      <NextScript/>
      <script src="http://dmaps.daum.net/map_js_init/postcode.v2.js"/>
      <script src="https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js"/>
      <script src="//developers.kakao.com/sdk/js/kakao.min.js"/>
      
      <noscript>
        한의플래닛은 스크립트를 이용해서 만들어진 사이트입니다. 브라우저 설정에서 스크립트를
        활성화해주세요
      </noscript>
      </body>
      </html>
    );
  }

}

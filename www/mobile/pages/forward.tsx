import React from 'react';
import {BASE_URL} from "../src/constants/env";
import {axiosInstance} from "@hanii/planet-apis";
import {Router} from "next/router";
import {parseCookies} from "nookies";
import {Base64} from 'js-base64';
import * as queryString from 'query-string';

const Forward = React.memo(() => {
  return (
      <p>loading...</p>
  )
});

Forward.displayName = 'Forward';

Forward.getInitialProps = async (ctx) => {
  const {query} = ctx;
  try {
    const {access} = parseCookies(ctx);
    const {to, ...rest} = query;
    await axiosInstance({token: access, baseURL: BASE_URL}).get(`/forward/?to=${query.to}&${queryString.stringify(rest)}`);
  } catch (e) {
    // pass
  }
  if(ctx.res) {
    ctx.res.writeHead(302, {
      Location: Base64.fromBase64(query.to)
    });
    ctx.res.end();
  } else {
    Router.push(Base64.fromBase64(query.to));
  }

  return {};
};

export default Forward;

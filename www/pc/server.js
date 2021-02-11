// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const {createServer} = require('http');
const {parse} = require('url');
const next = require('next');
const express = require('express');
const port = process.env.PORT || 3000;

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const DEV = process.env.NODE_ENV !== 'production';
const IS_PROD = !DEV;
const IS_API_STAGE = process.env.API_ENV === 'stage';
const IS_PROD_SERVER = IS_PROD && !IS_API_STAGE;

app.prepare().then(() => {
  const server = express();
  const Sentry = require('@sentry/node');
  IS_PROD_SERVER
  && Sentry.init({dsn: 'https://7d2965918bc844fe81129923929a06c7@sentry.io/1540869'});
  server.use(Sentry.Handlers.requestHandler());
  server.use(Sentry.Handlers.errorHandler());

  server.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const {pathname, query} = parsedUrl;
    try {
      handle(req, res, parsedUrl);
    } catch (err) {
      Sentry.captureException(err);
    }
  });
  server.listen(port, err => {
    if (err) {
      Sentry.captureException(err);
    }
    console.log('> Ready on http://localhost:' + port);
  });
});

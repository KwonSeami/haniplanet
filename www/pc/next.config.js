const webpack = require('webpack');
const path = require('path');
const UnusedWebpackPlugin = require('unused-webpack-plugin');

module.exports = {
  target: 'serverless',
  compression: true,
  pageExtensions: ['tsx', 'ts'],
  env: {
    API_ENV: process.env.API_ENV,
    STAGE_URL: process.env.STAGE_URL
  },
  // generateEtags: true,
  webpack: config => {
    // Fixes npm packages that depend on `fs` module

    config.node = {fs: 'empty'};
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      config.name === 'client' &&
      Object.entries(entries).forEach(([key, values]) => {
        if (key.includes('_app.js')) {
          entries[key] = Array.isArray(values) ? [...values, './polyfills.js'] : [values, './polyfills.js'];
        }
      });

      return entries;
    };

    config.plugins = config.plugins.filter(plugin => {
      if (plugin.constructor.name === 'ForkTsCheckerWebpackPlugin') return false;
      return true;
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.API_ENV': JSON.stringify(process.env.API_ENV),
        'process.env.TARGET_ENV': JSON.stringify(process.env.TARGET_ENV),
        'process.env.S3_BUCKET': JSON.stringify(process.env.S3_BUCKET),
      }),
    );

    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new UnusedWebpackPlugin({
          // Source directories
          directories: [path.join(__dirname, 'src')],
          // Exclude patterns
          exclude: [
            '*.test.ts',
            '@types/*.*',
            '*/__mocks__/*.*',
            'lib/order.ts',
            'lib/withoutFalsyValue.ts',
            'reducers/types.ts',
            'setupTests.ts',
          ],
          root: __dirname,
        }),
      );
    }

    return config;
  },
  // assetPrefix: isProd ? 'https://cdn.mydomain.com' : '',
};

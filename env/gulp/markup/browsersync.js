/*
 |--------------------------------------------------------------------------
 | Browsersync
 |--------------------------------------------------------------------------
 |
 | Browsersync is a tool that provides synchronized testing environment.
 | When navigating website on one device all user actions are automatically
 | replicated on all other devices where the website is open.
 | Browsersync also provides a live reload.
 |
 | More information:
 | https://www.browsersync.io/
 |
 */

let browserSync          = require('browser-sync');
let webpack              = require('webpack');
let webpackDevMiddleware = require('webpack-dev-middleware');
let webpackHotMiddleware = require('webpack-hot-middleware');
let messageFromFile      = require('../../lib/messageFromFile');
let config               = require('../../lib/getProjectConfig');

module.exports = () => {
  let bsSettings = {
    files: [{
      match: [
        `${config('paths.public')}/**/*.*`,
        `!${config('paths.public')}/app/uploads/**/*.*`
      ],
    }],

    server: config('paths.public')
  };

  // Setup React Hot Loader if enabled
  if (true === config('components.hot-loader')) {
    let webpackSettings = require('../../../webpack.config.js');
    let bundler = webpack(webpackSettings);

    bsSettings.server = {
      baseDir: config('paths.source'),

      middleware: [
        webpackDevMiddleware(bundler, {
          stats: { colors: true }
        }),

        webpackHotMiddleware(bundler)
      ]
    };
  }

  browserSync(bsSettings);
};

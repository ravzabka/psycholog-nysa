let gulp         = require('gulp');
let $            = require('gulp-load-plugins')({ lazy: true });
let webpack      = require('webpack');
let config       = require('../../lib/getProjectConfig');

function getWebpack(cb, watch = false) {
  // Check if webpack is enabled in the configuration
  let webpackComponent = config('components.webpack');
  if (!webpackComponent) {
    return cb();
  }

  // Load settings from webpack.config.js
  let settings = require('../../../webpack.config');
  if (true === watch) {
    settings.watch = true;
  }

  // Run webpack
  webpack(settings, (err, stats) => {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    $.util.log('[webpack]', stats.toString());
    
    if (!settings.watch) {
      cb();
    }
  });
}

module.exports = {
  default: cb => {
    getWebpack(cb);
  },

  watch: cb => {
    if (true === config('components.hot-loader')) {
      cb();
      return;
    }

    getWebpack(cb, true);
  }
};

let runSequence = require('run-sequence');
let config      = require('../../lib/getProjectConfig');

module.exports = callback => {
  runSequence(
    'html',
    'sprites',
    'styles',
    config('components.webpack') ? 'webpack' : 'scripts',
    callback
  );
};

let runSequence = require('run-sequence');

module.exports = callback => {
  runSequence(
    'build',
    'filepack',
    'summary',
    callback
  );
};

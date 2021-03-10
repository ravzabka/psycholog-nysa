let runSequence = require('run-sequence');

module.exports = callback => {
  runSequence(
    'build',
    'watch',
    callback
  );
};

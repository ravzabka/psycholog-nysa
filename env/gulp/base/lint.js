let runSequence = require('run-sequence');

module.exports = callback => {
  runSequence(
    'scripts:lint',
    callback
  );
};

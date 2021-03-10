/*
 |--------------------------------------------------------------------------
 | Module-specific build
 |--------------------------------------------------------------------------
 |
 | This is implemented in more specific modules.
 |
 | Any additional module should decide
 | which task should be running during project building
 |
 */
let runSequence = require('run-sequence');

module.exports = callback => {
    runSequence(
      'clean',

      'copy:source',
      'copy:third-party',
      'copy:dev-tools',

      'compile',
      'lint',

      callback
    );
};

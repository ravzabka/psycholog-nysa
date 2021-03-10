/*
|--------------------------------------------------------------------------
| Clean
|--------------------------------------------------------------------------
|
| Clears the contents of the public directory.
| Used at the beginning of the build to prepare for a clean build.
|
*/

let gulp   = require('gulp');
let $      = require('gulp-load-plugins')({ lazy: true });
let del    = require('del');
let config = require('../../lib/getProjectConfig');

module.exports = {
  default: cb => {
    del.sync([
      `${config('paths.public')}/**/*`,

      // Don't touch WordPress stuff if it's there
      `!${config('paths.public')}/app`,
      `!${config('paths.public')}/wp`,
    ]);

    cb();
  }
};

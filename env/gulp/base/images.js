let gulp = require('gulp');
let config = require('../../lib/getProjectConfig');
let $ = require('gulp-load-plugins')({lazy: true});

module.exports = {
  minify: () => {
    return gulp.src(`${config('paths.source')}/**/{*.jpg,*.jpeg,*.png,*.gif,*.svg}`)
      .pipe($.imagemin({verbose: true}))
      .pipe(gulp.dest(config('paths.source')));
  }
};

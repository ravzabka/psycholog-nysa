let path = require('path');
let imagemin = require('imagemin');
let config = require('./getProjectConfig');
let $ = require('gulp-load-plugins')({lazy: true});

/**
 * Minify given set of source images.
 *
 * @param {Array} file
 */
module.exports = file => {
  let filePath = path.relative(process.cwd(), file);
  filePath = path.relative(config('paths.source'), filePath);

  let reg = new RegExp('[^\\' + path.sep + ']+$');
  filePath = filePath.replace(reg, '');

  return imagemin([file], path.join(config('paths.source'), filePath), {
    plugins: [
      $.imagemin.gifsicle(),
      $.imagemin.jpegtran(),
      $.imagemin.optipng(),
      $.imagemin.svgo()
    ],
    verbose: true
  });
};

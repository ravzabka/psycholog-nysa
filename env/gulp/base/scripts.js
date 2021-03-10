/*
 |--------------------------------------------------------------------------
 | Scripts
 |--------------------------------------------------------------------------
 |
 | Contains tasks handling scripts.
 | Default task builds a JS file using includes, similar to scss.
 | Sample includes syntax (on top of main JS file):
 | //=include relative/path/to/file.js
 | //=require relative/path/to/file.js
 |
 | Or to include all files from folder:
 | //=require scripts/** /*.js
 |
 | Folders starting with '__' are treated as source and not copied
 | to public folder.
 |
 */

let gulp = require('gulp');
let fs = require('fs');
let $ = require('gulp-load-plugins')({lazy: true});
let isProduction = require('../../lib/isProduction')
let config = require('../../lib/getProjectConfig');

module.exports = {
  /**
   * Build javascript file from modules and place it in public folder.
   */
  default: () => {
    let task = gulp.src([
      `${config('paths.source')}/**/*.js`,
      `!${config('paths.source')}/**/__*{,/**}`
    ])
      .pipe($.plumber())

      // Allow to use includes in JS files
      .pipe($.include());

    if (true === global.isWatching) {
      task = task.pipe($.changed(config('paths.public'), { hasChanged: $.changed.compareSha1Digest }));
    }

    task = task
      // Output unminified files
      .pipe(gulp.dest(config('paths.public')))

      // Minify files and output them with .min.js extension
      .pipe($.uglify())
      .pipe($.rename({extname: '.min.js'}))

      // Output minified files
      .pipe(gulp.dest(config('paths.public')));

    return task;
  },

  /**
   * Lint JS files and check for coding standards infractions
   * using ESLint.
   */
  lint: () => {
    return gulp.src([
      `${config('paths.source')}/**/*.js`,
      `!${config('paths.source')}/**/__*{,/**}`
    ])
      .pipe($.eslint())
      .pipe($.eslint.format(
        'stylish',
        fs.createWriteStream('reports/eslint')
      ))
      .pipe($.eslint.format(
        'json',
        fs.createWriteStream('reports/eslint.json')
      ));
  },
};

/*
 |--------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------
 |
 | Contains tasks handling styles.
 | The default task compiles styles sources (*.sass, *.scss) from source
 | to the pubic directory and validates them with csslint. The styles are
 | processed using autoprefixer and on production are also automatically
 | minified.
 |
 */

let gulp            = require('gulp');
let path            = require('path');
let $               = require('gulp-load-plugins')({ lazy: true });
let autoprefixer    = require('autoprefixer');
let cssnano         = require('cssnano');
let browsersync     = require('browser-sync');
let config          = require('../../lib/getProjectConfig');
let isProduction    = require('../../lib/isProduction');
let messageFromFile = require('../../lib/messageFromFile');
let fs              = require('fs-extra');

module.exports = {
  /**
   * Compile style sources from source to public directory.
   */
  default: () => {
    // Add custom formatter for csslint displaying report in console
    $.csslint.addFormatter('csslint-stylish');

    let lintOutput = '';
    let lintOutputXml = '';

    let task = gulp.src([
      `${config('paths.source')}/**/*.{sass,scss}`,
      `!${config('paths.source')}/**/__*{,/**}`
    ])
      .pipe($.plumber())
      .pipe($.sourcemaps.init())

      // Compile styles and display errors in BS
      .pipe($.sass({
        outputStyle: 'expanded',
        precision: 8
      }).on('error', function(error) {
        if (true === global.isWatching) {
          let message = error.messageFormatted.replace(/\n/g, '<br>');
          browsersync.notify(message, 2 * 60 * 1000);
        } else {
          console.log(error.messageFormatted);
        }

        this.emit('end');
      }));

    // Group media queries
    task = task.pipe($.groupCssMediaQueries())

      // Process compiled styles
      .pipe($.postcss([ autoprefixer ]));

    if (!global.isWatching) {
      task = task
        // Validate styles using csslint
        // Write the report to: reports/csslint
        .pipe($.csslint())
        .pipe($.csslint.formatter('stylish', {
          logger: str => {
            lintOutput += str;
          }
        }).on('end', () => {
          fs.writeFile('reports/csslint', lintOutput, err => { if(err) messageFromFile('csslint-error'); } );
        }))
        .pipe($.csslint.formatter('lint-xml', {
          logger: str => {
            lintOutputXml += str;
          }
        }).on('end', () => {
          fs.writeFile('reports/csslint.xml', lintOutputXml, err => { if(err) messageFromFile('csslint-error'); } );
        }));
    }

    // Output non-minified files
    task = task
      .pipe($.changed(config('paths.public'), { hasChanged: $.changed.compareSha1Digest }))
      .pipe(gulp.dest(config('paths.public')));

    // Minifiy files
    if (!global.isWatching) {
      task = task.pipe($.postcss([ cssnano ]));
    }

    if (!isProduction()) {
      task = task.pipe($.sourcemaps.write());
    }

    task = task
      .pipe($.rename({ extname: '.min.css' }))
      .pipe(gulp.dest(config('paths.public')));

    return task;
  },
};

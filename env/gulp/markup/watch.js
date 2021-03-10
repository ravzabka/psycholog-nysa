let gulp         = require('gulp');
let path         = require('path');
let watch        = require('gulp-watch');
let config       = require('../../lib/getProjectConfig');
let minifyImages = require('../../lib/minifyImages');

module.exports = () => {
  global.isWatching = true;

  let watcher = watch([
    `./${config('paths.source')}/**/*`,
    `!./${config('paths.source')}/**/*.{jpg,jpeg,png,gif,svg}`,
  ]);
  watcher.on('change', file => {
    let extension = path.extname(file);

    // Process HTML
    if ('.html' === extension) {
      gulp.start('html');
    }

    // Compile scripts
    else if ('.js' === extension && !config('components.webpack')) {
      gulp.start('scripts');
    }

    // Compile styles
    else if (['.scss', '.sass'].includes(extension)) {
      gulp.start('styles');
    }

    // Copy all other files
    else {
      gulp.start('copy:source');
    }
  });

  // Watch images and minify them when adding to source
  // Move images to public folder after minifying
  let imagesWatcher = watch([
    `./${config('paths.source')}/**/*.{jpg,jpeg,png,gif,svg}`,
  ]);
  imagesWatcher.on('add', file => {
    let extension = path.extname(file);

    if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(extension)) {
      console.log(`Optimizing ${file}`);
      minifyImages(file).then(() => {
        gulp.start('copy:source');
      });
    }
  });

  // Run webpack watch if enabled
  if (config('components.webpack')) {
    gulp.start('webpack:watch');
  }

  // Run Browsersync
  gulp.start('browsersync');
};

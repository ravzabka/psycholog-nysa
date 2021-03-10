/*
|--------------------------------------------------------------------------
| Copy
|--------------------------------------------------------------------------
|
| Copy files from one directory to another (typically - to the public
| directory). Source files (*.scss, *.coffee, etc) are not copied.
| Directories with names starting with '__' are treated as sources,
| and are not copied either.
|
*/

let gulp         = require('gulp');
let config       = require('../../lib/getProjectConfig');
let isProduction = require('../../lib/isProduction');
let changed      = require('gulp-changed');
let $            = require('gulp-load-plugins')({ lazy: true });

module.exports = {

  /**
   * Copy files from source to the public directory.
   */
  source: () => {
    return gulp.src([
      `${config('paths.source')}/**/*`,
      `!${config('paths.source')}/**/__*{,/**}`,
      `!${config('paths.source')}/**/*.html`,
      `!${config('paths.source')}/**/*.{coffee,scss,sass,less,jade,styl,tpl}`,
      `!${config('paths.source')}/**/.*.{coffee,scss,sass,less,jade,styl,tpl}`,
      `!${config('paths.source')}/**/*.{js,jsx}`,
      `!${config('paths.source')}/**/.*.{js,jsx}`
    ])
      .pipe($.plumber())
      .pipe(changed(config('paths.public')))
      .pipe(gulp.dest(config('paths.public')));
  },

  /**
   * Copy all uploads from public to source.
   */
  [ 'uploads-to-source' ]: () => {
    if ('wordpress' !== config('project.type')) {
      return;
    }

    return gulp.src([
      `${config('paths.public')}/app/uploads/**/*`,
      '!**/*-+([0-9])x+([0-9]).{jpg,jpeg,png,gif}',
      '!**/*@2x.{jpg,jpeg,png,gif}'
    ])
      .pipe(gulp.dest(`${config('paths.source')}/app/uploads`));
  },

  /**
   * Copy all uploads from source to public
   */
  [ 'uploads-to-public' ]: () => {
    if ('wordpress' !== config('project.type')) {
      return;
    }

    return gulp.src([
      `${config('paths.source')}/app/uploads/**/*`,
      '!**/*-+([0-9])x+([0-9]).{jpg,jpeg,png,gif}',
      '!**/*@2x.{jpg,jpeg,png,gif}'
    ])
      .pipe(gulp.dest(`${config('paths.public')}/app/uploads`));
  },

  /**
   * Copy all third party plugins and libraries.
   * These are the things that are not available via dependency managers,
   * but we don't want to keep them in source folder.
   */
  [ 'third-party' ]: () => {
    return gulp.src(`${config('paths.thirdParty')}/**/*`)
      .pipe(gulp.dest(config('paths.public')));
  },

  /**
   * Copy development tools to the public directory.
   * Development tools will only be copied if developing locally.
   */
  [ 'dev-tools' ]: () => {
    if (isProduction()) {
      return;
    }

    return gulp.src(`${config('paths.devTools')}/**/*`)
      .pipe(gulp.dest(config('paths.public')));
  }
};

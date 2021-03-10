/*
|--------------------------------------------------------------------------
| Sprites
|--------------------------------------------------------------------------
|
| Sprites generated using gulp.spritesmith.
| Sprite generation is fully customizable:
| see gulp/config/sprites.example.json for configuration.
|
*/

let gulp       = require('gulp');
let $          = require('gulp-load-plugins')({ lazy: true });
let fileExists = require('../../lib/fileExists');
let path       = require('path');
let config     = require('../../lib/getProjectConfig');

module.exports = () => {
  /*
   * Check if the sprite configuration exists.
   * We'll not display an error if it doesn't. That may just mean that the project
   * is not using sprites.
   */
  let configPath = 'config/sprites.json';
  if (!fileExists(configPath)) {
    return;
  }

  /*
   * Load sprites configuration.
   */
  let spriteConfig = require(path.join(process.cwd(), configPath));

  /*
   * Sprite file name and images directory are required.
   */
  if ('' === spriteConfig.name || '' === spriteConfig.images) {
    return;
  }

  /*
   * These three options are optional.
   * Make sure to default them to something if they are not in the config.
   */
  let format = spriteConfig.format || 'scss';
  let retina = spriteConfig.retina || false;
  let styles = spriteConfig.styles || '.';

  /*
   * Base spritesmith configuration.
   */
  let spritesmithConfig = {
    imgName: `${spriteConfig.images}/../${spriteConfig.name}.png`,
    cssName: `${styles}/_sprite-${spriteConfig.name}.${format}`
  };

  /*
   * Retina configuration.
   * This will only be active if "retina" in config json is set to true.
   * Retina versions of sprite images end with @2x.
   */
  if (true === retina) {
    spritesmithConfig.retinaSrcFilter = [`${config('paths.source')}/${spriteConfig.images}/*@2x{.png,.jpg}`];
    spritesmithConfig.retinaImgName = `${spriteConfig.images}/../${spriteConfig.name}@2x.png`;
  }

  /*
   * Run the gulp spritesmith to generate sprites.
   */
  gulp.src(`${config('paths.source')}/${spriteConfig.images}/*{.png,.jpg}`)
    .pipe($.spritesmith(spritesmithConfig))
    .pipe(gulp.dest(config('paths.public')));
};

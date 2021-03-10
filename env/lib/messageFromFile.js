let path = require('path');
let fs   = require('fs');
let $    = require('gulp-load-plugins')({ lazy: true });

/**
 * Print the message in the console from the given file.
 * Message can span multiple lines, and each line can optionally have a color
 * specified at the beginning. Example:
 * [red] This line will be displayed in red.
 *
 * @param {string} file - Path to the file containing the message.
 */
module.exports = file => {
  let message = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');
  message = message.split('\n');

  message.forEach(line => {
    let color = line.match(/^\[(.+)]/);
    if (color) {
      color = color[1];
      line = line.replace(/^\[(.+)]/, '').trim();

      if (typeof $.util.colors[color] === 'function') {
        $.util.log($.util.colors[color](line));
        return;
      }
    }

    if ('' !== line) {
      $.util.log(line);
    }
  });
};

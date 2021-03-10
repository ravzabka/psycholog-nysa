let fs           = require('fs-extra');
let Archive      = require('../../lib/Archive');
let isProduction = require('../../lib/isProduction');
let config       = require('../../lib/getProjectConfig');
let fileExists   = require('../../lib/fileExists');

module.exports = {
  default: cb => {
    let archive = new Archive(config('paths.public'), 'filepack.zip');

    // Public folder contents
    archive.archive.glob('**/*', {
      cwd: config('paths.public'),
      ignore: ['filepack.zip', 'qa-summary.html']
    });

    // Sources, if configured to include sources
    if (true === config('project.sources')) {
      archive.add(['**/*.{scss,sass}'], config('paths.source'), 'sources/styles');
    }

    if (true === config('project.sources') || config('components.webpack')) {
      archive.add(['**/*.{js,jsx}'], config('paths.source'), 'sources/js');
    }

    // If we're using webpack we need to throw webpack config and
    // package.json into the filepack.
    if (config('components.webpack')) {
      archive.archive.file('webpack.config.js', { name: 'configs/webpack.config.js' });

      // package.json
      // ---------------------------------------------
      let contents = fs.readFileSync('package.json').toString();
      contents = JSON.parse(contents);

      // Don't leave any references to Chop-Chop in final package.json
      contents.name = '';

      // Remove any scripts other than webpack-related
      const scripts = contents.scripts;
      for (script in scripts) {
        if (!script.match(/^webpack/)) {
          delete scripts[script];
        }
      }

      // Remove all environment dependencies, except those required
      // to compile things with webpack.
      const devDependencies = contents.devDependencies;
      for (dep in devDependencies) {
        // Keep webpack
        if ('webpack' === dep) {
          continue;
        }

        // Keep transpilers
        if (dep.match(/^babel/)) {
          continue;
        }

        // Remove everything else
        delete devDependencies[dep];
      }

      archive.archive.append(JSON.stringify(contents, null, 4), { name: 'configs/package.json' });
    }

    archive.save();
    cb();
  }
};

let fileExists   = require('./fileExists');
let message      = require('./messageFromFile');
let isProduction = require('./isProduction');
let nested       = require('nested-property');

/**
 * Deep merges source into destination.
 *
 * @param {object} destination - Object to merge source into.
 * @param {object} source      - Object to merge into destination.
 */
function merge(destination, source) {
  for (let property in source) {
    if (destination.hasOwnProperty(property)) {
      if ('object' === typeof destination[property]) {
        merge(destination[property], source[property]);
      } else {
        destination[property] = source[property];
      }

      continue;
    }

    destination[property] = source[property];
  }
}

/**
 * Retrieve variables from the configuration files.
 * The function takes into account whether we are in production and retrieves
 * production or local values for variables accordingly.
 * Syntax for the name parameter is:
 * "some.variable.name"
 * Where "." accesses the next nesting level.
 *
 * @param name
 * @returns {*}
 */
module.exports = (name) => {
  if (!fileExists('config/project.json')) {
    message('env/messages/config-missing');
    process.exit();
  }

  let project = require('../../config/project.json');

  let local = null;
  if (fileExists('config/local.json')) {
    local = require('../../config/local.json');
  }

  if (!isProduction() && local) {
    merge(project, local);
  }

  return nested.get(project, name) || null;
};

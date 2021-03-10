let path = require('path');
let fs   = require('fs');

/**
 * Check if the file with a given name exists. Path to the file should be
 * relative to the root of the project.
 *
 * @param {string} file - Path to the file to check.
 * @returns {boolean} - True if file exists, false otherwise.
 */
module.exports = file => {
  try {
    fs.accessSync(path.join(process.cwd(), file), fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
};

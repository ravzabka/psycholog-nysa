let config = require('./getProjectConfig')

/**
 * Retrieve the project URL from the settings.
 *
 * @returns {*} - Project URL, false if not set.
 */
module.exports = () => {
  if ('wordpress' === config('project.type') && process.env.APP_URL) {
    return process.env.APP_URL;
  }

  let url = config('project.url');
  if (url && url !== '') {
    return url;
  }

  return false;
};

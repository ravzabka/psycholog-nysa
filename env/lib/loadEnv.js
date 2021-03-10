let fs = require('fs');

/**
 * Iterate through an array of lines from .env file and extract variables from them.
 * Comments (lines starting with '#') and anything in format other than A=B is ignored.
 *
 * @param {array} lines - Array of strings.
 * @return {object} - Object where keys are names and values are values of .env variables.
 */
function parseLines(lines) {
  let vars = {};
  lines.forEach(line => {
    if ('#' === line.charAt(0)) {
      return;
    }

    let variable = line.match(/(.+?)=(.+)/);
    if (!variable) {
      return;
    }

    vars[variable[1]] = variable[2].replace(/['|"]/g, '');
  });

  return vars;
}

/**
 * Variables in .env file can use other variables in their content. The format is following:
 * VARIABLE_ONE=${VARIABLE_TWO}
 * This function will interpolate all those variables if possible.
 *
 * @param {object} vars - Object with .env variables.
 * @return {object} - Object with interpolated .env variables.
 */
function interpolateVariables(vars) {
  for (let variable in vars) {
    let value = vars[variable];
    let injectReg = /\${(.+?)}/;

    let interpolation = value.match(injectReg);
    if (!interpolation) {
      continue;
    }

    if (!vars.hasOwnProperty(interpolation[1])) {
      continue;
    }

    vars[variable] = value.replace(injectReg, vars[interpolation[1]]);
  }

  return vars;
}

module.exports = () => {
  let lines = fs.readFileSync(process.cwd() + '/.env')
    .toString()
    .split('\n');

  let vars = parseLines(lines);
  vars = interpolateVariables(vars);

  for (let variable in vars) {
    process.env[variable] = vars[variable];
  }

  if (process.env.APP_URL && ! process.env.WP_SITEURL) {
    process.env.WP_SITEURL = process.env.APP_URL + '/wp';
  }
};

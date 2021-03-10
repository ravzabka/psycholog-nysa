let fs = require('fs-extra');
let path = require('path');
let _ = require('underscore');
let config = require('../../lib/getProjectConfig');
let fileExists = require('../../lib/fileExists');

/**
 * Check if filepack exists.
 *
 * @return {string|bool} - Name of the filepack if exists, false otherwise.
 */
function getFilepack() {
  let filepack = path.join(config('paths.public'), 'filepack.zip').replace(/\\/, '/');
  if (fileExists(filepack)) {
    return filepack;
  }

  return false;
}

/**
 * Get the list of all HTML files in public directory.
 *
 * @return {Array} - List of HTML pages.
 */
function getHtmlPages() {
  let files = fs.readdirSync(config('paths.public'));
  let htmlFiles = [];
  for (let file of files) {
    let extension = path.extname(file);

    if ('.html' !== extension) {
      continue;
    }

    if ('qa-summary.html' === file) {
      continue;
    }

    htmlFiles.push(file);
  }

  return htmlFiles;
}

/**
 * Get the list of all pages not present as HTML files (e.g. from CMS) from config.
 *
 * @return {Array} - List of pages.
 */
function getOtherPages() {
  let summaryConfig = 'config/summary.json';
  if (!fileExists(summaryConfig)) {
    return [];
  }

  try {
    summaryConfig = JSON.parse(fs.readFileSync(summaryConfig).toString());
    if (!summaryConfig.links || !summaryConfig.links.length) {
      return [];
    }

    return summaryConfig.links;
  } catch (e) {
    return [];
  }
}

/**
 * Read ESLint report and prepare information about JS warnings and errors.
 *
 * @return {object|bool} - true if there are no errors, false if report file is missing, object otherwise.
 */
function getJsErrors() {
  let jsReport = 'reports/eslint.json';
  if (!fileExists(jsReport)) {
    return false;
  }

  try {
    jsReport = JSON.parse(fs.readFileSync(jsReport).toString());

    if (!jsReport.length) {
      return true;
    }

    let errors = 0;
    let warnings = 0;

    for (let file of jsReport) {
      errors += file.errorCount;
      warnings += file.warningCount;
    }

    if (0 === errors && 0 === warnings) {
      return true;
    }

    return {
      errors,
      warnings
    }
  } catch (e) {
    return false;
  }
}

/**
 * Read CSSLint report and find out the number of CSS errors.
 *
 * @return {number|bool} - false if report file doesn't exist, the number of errors otherwise.
 */
function getCssErrors() {
  let cssReport = 'reports/csslint.xml';
  if (!fileExists(cssReport)) {
    return false;
  }

  cssReport = fs.readFileSync(cssReport).toString();
  return (cssReport.match(/<issue/g) || []).length;
}

/**
 * Generate QA summary.
 */
module.exports = cb => {
  // Check if public folder exists
  if (!fileExists(config('paths.public'))) {
    console.log('Compile the project first!');
    return;
  }

  let file = 'qa-summary.html';

  let templatePath = `env/${file}`;
  let outputPath = path.join(config('paths.public'), file);

  // Check if summary template file exists
  if (!fileExists(templatePath)) {
    console.log('Summary template doesn\'t exist');
    cb();
    return;
  }

  let contents = fs.readFileSync(templatePath).toString();
  let template = _.template(contents);

  fs.writeFileSync(outputPath, template({
    filepack: getFilepack(),
    pages: [...getHtmlPages(), ...getOtherPages()],
    jsErrors: getJsErrors(),
    cssErrors: getCssErrors()
  }));

  cb();
};

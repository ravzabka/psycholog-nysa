module.exports = name => {
  let parameterIndex = process.argv.indexOf(`--${name}`);
  if (parameterIndex < 0) {
    return false;
  }

  return process.argv[parameterIndex + 1];
};

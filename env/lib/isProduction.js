/**
 * Check if we're in the Production environment. Generally Production means we
 * are making a deploy, and onto the non-development URL (e.g. "tag--PROJECT-ID").
 * Optionally Production can be forced locally for testing with "--production" flag.
 *
 * @returns {boolean}
 */
module.exports = () => {
  let hasProductionFlag = (process.argv.indexOf('--production') !== -1);
  let isLocal = (typeof process.env.APP_ENV !== 'undefined' && 'local' === process.env.APP_ENV);

  let isDevUrl = false;
  if (typeof process.env.APP_URL !== 'undefined') {
    isDevUrl = !!process.env.APP_URL.match(/^https?:\/\/\w+\.\w+\.dev2/);
  }

  return (
    // On localhost we can force Production with "--production" flag.
    (isLocal && hasProductionFlag) ||

    // Otherwise, Production is when deploying on non-dev URL.
    (!isDevUrl && hasProductionFlag)
  );
};

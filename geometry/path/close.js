const clone = require('./clone');

/**
 * Makes the path be closed.
 * @params {path} path - the path to close.
 * @returns {path} the closed path.
 */
const close = path => {
  const cloned = clone(path);
  cloned.isClosed = true;
  return cloned;
};

module.exports = close;

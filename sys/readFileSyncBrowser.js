const readFileSync = (path, options) => {
  const files = require('./files');
  const file = files[path];
  if (file === undefined) {
    // FIX: Error parity.
    return undefined;
  }
  return file.data;
};

module.exports.readFileSync = readFileSync;

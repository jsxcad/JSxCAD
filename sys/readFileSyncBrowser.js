const { getFile } = require('./files');


const readFileSync = (path, options) => {
  const file = getFile(path);
  if (typeof file.data === 'function') {
    // Force lazy evaluation.
    file.data = file.data();
  }
  return file.data;
};

module.exports.readFileSync = readFileSync;

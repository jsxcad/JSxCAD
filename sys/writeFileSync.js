const fs = require('fs');
const writeFileSyncBrowser = require('./writeFileSyncBrowser');

const writeFileSync = (path, data, options) => {
  const { translator } = options;
  if (fs) {
    if (translator) {
      return fs.writeFileSync(path, translator(), options);
    } else {
      return fs.writeFileSync(path, data, options);
    }
  } else {
    return writeFileSyncBrowser.writeFileSync(path, data, options);
  }
};

module.exports.writeFileSync = writeFileSync;

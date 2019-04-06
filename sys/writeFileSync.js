const fs = require('fs');
const writeFileSyncBrowser = require('./writeFileSyncBrowser');

const writeFileSync = (path, data, options = {}) => {
  if (fs.writeFileSync) {
    if (typeof data === 'function') {
      data = data();
    }
    return fs.writeFileSync(path, data, options);
  } else {
    return writeFileSyncBrowser.writeFileSync(path, data, options);
  }
};

module.exports.writeFileSync = writeFileSync;

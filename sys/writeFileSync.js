const fs = require('fs');
const writeFileSyncBrowser = require('./writeFileSyncBrowser');

const writeFileSync = async (path, data, options = {}) => {
console.log(`QQ/writeFileSync/path: ${path}`);
console.log(`QQ/writeFileSync/options: ${JSON.stringify(options)}`);
  if (fs.writeFileSync) {
    if (typeof data === 'function') {
      data = data();
    }
    return fs.writeFileSync(path, await Promise.resolve(data), options);
  } else {
    return writeFileSyncBrowser.writeFileSync(path, data, options);
  }
};

module.exports.writeFileSync = writeFileSync;

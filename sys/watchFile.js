const fs = require('fs');
const watchFileBrowser = require('./watchFileBrowser');

const watchFile = (path, thunk) => {
  if (fs.writeFileSync) {
  } else {
    watchFileBrowser.watchFile(path, thunk);
  }
};

module.exports.watchFile = watchFile;

const fs = require('fs');
const readFileSyncBrowser = require('./readFileSyncBrowser');
const fetch = require('node-fetch');

export const readFile = (path, options) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (fetch) {
      return fetch(path).then(result => result.text());
    } else {
      return window.fetch(path).then(result => result.text());
    }
  }
  if (fs.promises.readFile) {
    return fs.promises.readFile(path, options);
  } else {
    return Promise.resolve(readFileSyncBrowser(path, options));
  }
};

const IS_BROWSER = global['IS_BROWSER'];

const watchFile = (path, thunk) => {
  if (IS_BROWSER) {
    require('./watchFileBrowser').watchFile(path, thunk);
  } else {
    // Do nothing.
  }
}

module.exports.watchFile = watchFile;

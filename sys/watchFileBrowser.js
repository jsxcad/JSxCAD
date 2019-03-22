const watchFile = (path, thunk) => {
  const files = require('./files');
  let file = files[path];
  if (file === undefined) {
    file = { path: path, watchers: [] };
    files[path] = file;
  }
  file.watchers.push(thunk);
}

module.exports.watchFile = watchFile;

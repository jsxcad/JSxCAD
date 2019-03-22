const writeFileSync = (path, data, options) => {
  const files = require('./files');
  let file = files[path];
  if (file === undefined) {
    file = { path: path, watchers: [] };
    files[path] = file;
  }
  file.data = data;
  for (const watcher of file.watchers) {
    watcher(file);
  }
}

module.exports.writeFileSync = writeFileSync;

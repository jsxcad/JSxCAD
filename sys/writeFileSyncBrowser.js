const { getFile } = require('./files');

const writeFileSync = (path, data, { translator } = {}) => {
  const file = getFile(path);
  file.data = data;
  file.translator = translator;

  for (const watcher of file.watchers) {
    watcher(file, options);
  }
};

module.exports.writeFileSync = writeFileSync;

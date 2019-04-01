const files = {};
const fileCreationWatchers = [];

const getFile = (path) => {
  let file = files[path];
  if (file === undefined) {
    file = { path: path, watchers: [] };
    files[path] = file;
    for (const watcher of fileCreationWatchers) {
      watcher(file);
    }
  }
  return file;
};

const watchFileCreation = (thunk) => fileCreationWatchers.push(thunk);

module.exports.getFile = getFile;
module.exports.watchFileCreation = watchFileCreation;

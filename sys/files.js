const files = {};

const getFile = (path) => {
  let file = files[path];
  if (file === undefined) {
    file = { path: path, watchers: [] };
    files[path] = file;
  }
  return file;
};

module.exports.getFile = getFile;

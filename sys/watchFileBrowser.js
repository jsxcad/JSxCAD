const { getFile } = require('./files');

const watchFile = (path, thunk) => getFile(path).watchers.push(thunk);

module.exports.watchFile = watchFile;

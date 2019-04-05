const { getFile } = require('./files');

const readFileSync = (path, options) => getFile(path);

module.exports.readFileSync = readFileSync;

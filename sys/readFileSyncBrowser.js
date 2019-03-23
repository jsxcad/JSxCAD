const { getFile } = require('./files');

const readFileSync = (path, options) => getFile(path).data;

module.exports.readFileSync = readFileSync;

const toPoints = require('./toPoints');

const toPaths = (options = {}, geometry) => [toPoints({}, geometry)];

module.exports = toPaths;

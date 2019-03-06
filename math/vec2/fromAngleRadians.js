const fromValues = require('./fromValues');

const fromAngleRadians = (radians) => fromValues(Math.cos(radians), Math.sin(radians));

module.exports = fromAngleRadians;

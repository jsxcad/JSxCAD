const angleRadians = require('./angleRadians');
const { radToDeg } = require('@jsxcad/math-utils');

const angleDegrees = (vector) => radToDeg(angleRadians(vector));

module.exports = angleDegrees;

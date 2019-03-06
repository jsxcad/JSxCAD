const { fromScaling } = require('@jsxcad/math-mat4');
const transform = require('./transform');

const scaling = (dimensions, polygons) => transform(fromScaling(dimensions), polygons);

module.exports = scaling;

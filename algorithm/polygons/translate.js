const { fromTranslation } = require('@jsxcad/math-mat4');
const transform = require('./transform');

const translation = (vector, polygons) => transform(fromTranslation(vector), polygons);

module.exports = translation;

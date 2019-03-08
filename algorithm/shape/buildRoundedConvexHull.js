const { eachPoint, transform } = require('@jsxcad/algorithm-polygons');
const { fromScaling, fromTranslation } = require('@jsxcad/math-mat4');
const buildConvexHull = require('./buildConvexHull');
const buildGeodesicSphere = require('./buildGeodesicSphere');

const scale = (vec, polygons) => transform(fromScaling(vec), polygons);
const translate = (vec, polygons) => transform(fromTranslation(vec), polygons);

const buildRoundedConvexHull = ({ roundingRadius = 0.1, roundingFaces = 8 }, points) => {
  const sphere = scale([roundingRadius, roundingRadius, roundingRadius], buildGeodesicSphere({ faces: roundingFaces }));
  const hullPoints = [];
  points.forEach(point => eachPoint({}, point => hullPoints.push(point), translate(point, sphere)));
  return buildConvexHull({}, hullPoints);
};

module.exports = buildRoundedConvexHull;

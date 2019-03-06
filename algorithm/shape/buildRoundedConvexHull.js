const { eachPoint, scale, translate } = require('@jsxcad/algorithm-polygons');
const buildConvexHull = require('./buildConvexHull');
const buildGeodesicSphere = require('./buildGeodesicSphere');

const buildRoundedConvexHull = ({ roundingRadius = 0.1, roundingFaces = 8 }, points) => {
  const sphere = scale([roundingRadius, roundingRadius, roundingRadius], buildGeodesicSphere({ faces: roundingFaces }));
  const hullPoints = [];
  points.forEach(point => eachPoint({}, point => hullPoints.push(point), translate(point, sphere)));
  return buildConvexHull({}, hullPoints);
};

module.exports = buildRoundedConvexHull;

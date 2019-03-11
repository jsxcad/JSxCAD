import { eachPoint, transform } from '@jsxcad/algorithm-polygons';
import { fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { buildConvexHull } from './buildConvexHull';
import { buildGeodesicSphere } from './buildGeodesicSphere';

const scale = (vec, polygons) => transform(fromScaling(vec), polygons);
const translate = (vec, polygons) => transform(fromTranslation(vec), polygons);

export const buildRoundedConvexHull = ({ roundingRadius = 0.1, roundingFaces = 8 }, points) => {
  const sphere = scale([roundingRadius, roundingRadius, roundingRadius], buildGeodesicSphere({ faces: roundingFaces }));
  const hullPoints = [];
  points.forEach(point => eachPoint({}, point => hullPoints.push(point), translate(point, sphere)));
  return buildConvexHull({}, hullPoints);
};

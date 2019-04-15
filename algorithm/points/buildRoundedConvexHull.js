import { eachPoint, transform } from '@jsxcad/algorithm-polygons';
import { fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { buildConvexHull } from './buildConvexHull';

const scale = (vec, polygons) => transform(fromScaling(vec), polygons);
const translate = (vec, polygons) => transform(fromTranslation(vec), polygons);

export const buildRoundedConvexHull = ({ roundingRadius = 0.1, roundingFaces = 8 }, points, unitRounder) => {
  const rounder = scale([roundingRadius, roundingRadius, roundingRadius], unitRounder);
  const hullPoints = [];
  points.forEach(point => eachPoint({}, point => hullPoints.push(point), translate(point, rounder)));
  return buildConvexHull({}, hullPoints);
};

import { Shape } from './Shape';
import { buildConvexHull } from '@jsxcad/algorithm-points';

export const hull = (...geometries) => {
  // FIX: Support z0Surface hulling.
  const points = [];
  geometries.forEach(geometry => geometry.eachPoint({}, point => points.push(point)));
  return Shape.fromPolygonsToSolid(buildConvexHull({}, points));
};

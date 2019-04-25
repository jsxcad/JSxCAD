import { Solid } from './Solid';
import { buildConvexHull } from '@jsxcad/algorithm-points';

export const hull = (...geometries) => {
  const allPoints = [].concat(...geometries.map(geometry => geometry.toPoints()));

  return Solid.fromPolygons(buildConvexHull({}, allPoints));
};

import { CSG } from './CSG';
import { buildConvexHull } from '@jsxcad/algorithm-points';

export const hull = (...geometries) => {
  const allPoints = [].concat(...geometries.map(geometry => geometry.toPoints()));

  return CSG.fromPolygons(buildConvexHull({}, allPoints));
};

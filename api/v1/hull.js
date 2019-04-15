import { buildConvexHull } from '@jsxcad/algorithm-points';
import { CSG } from './CSG';

export const hull = (...geometries) => {
  const allPoints = [].concat(...geometries.map(geometry => geometry.toPoints()));

  return CSG.fromPolygons(buildConvexHull({}, allPoints));
};

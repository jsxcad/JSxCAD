import { buildConvexHull, buildConvexMinkowskiSum } from '@jsxcad/algorithm-points';
import { CSG } from './CSG';

// TODO: Generalize for more operands?
export const minkowski = (a, b) => {
  return CSG.fromPolygons(buildConvexHull({}, buildConvexMinkowskiSum({}, a.toPoints(), b.toPoints())));
};

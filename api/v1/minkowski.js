import { buildConvexHull, buildConvexMinkowskiSum } from '@jsxcad/algorithm-points';
import { Solid } from './Solid';

// TODO: Generalize for more operands?
export const minkowski = (a, b) => {
  return Solid.fromPolygons(buildConvexHull({}, buildConvexMinkowskiSum({}, a.toPoints(), b.toPoints())));
};

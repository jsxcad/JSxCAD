import { buildConvexHull, buildConvexMinkowskiSum } from '@jsxcad/algorithm-points';

import { Solid } from './Solid';

// TODO: Generalize for more operands?
export const minkowski = (a, b) => {
  const aPoints = [];
  const bPoints = [];
  a.eachPoint({}, point => aPoints.push(point));
  b.eachPoint({}, point => bPoints.push(point));
  return Solid.fromPolygons(buildConvexHull({}, buildConvexMinkowskiSum({}, aPoints, bPoints)));
};

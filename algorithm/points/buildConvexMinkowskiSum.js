import { eachPoint } from '@jsxcad/algorithm-polygons';
import { buildConvexHull } from './buildConvexHull';
import { translate } from './ops';

export const buildConvexMinkowskiSum = (options = {}, aPoints, bPoints) => {
  const summedPoints = [];
  for (const aPoint of aPoints) {
    for (const summedPoint of translate(aPoint, bPoints)) {
      summedPoints.push(summedPoint);
    }
  }
  return summedPoints;
};

import { buildConvexHull } from './buildConvexHull';
import { cache } from '@jsxcad/cache';
import { translate } from '@jsxcad/geometry-points';

const buildConvexMinkowskiSumImpl = (aPoints, bPoints) => {
  const summedPoints = [];
  for (const aPoint of aPoints) {
    for (const summedPoint of translate(aPoint, bPoints)) {
      summedPoints.push(summedPoint);
    }
  }
  return buildConvexHull(summedPoints);
};

export const buildConvexMinkowskiSum = cache(buildConvexMinkowskiSumImpl);

import { endTime, logInfo, startTime } from '@jsxcad/sys';

import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const differenceOfSurfaceMeshes = (a, aTransform, b, bTransform) => {
  const timer = startTime('differenceOfSurfaceMeshes');
  const result = getCgal().DifferenceOfSurfaceMeshes(
    a,
    toCgalTransformFromJsTransform(aTransform),
    b,
    toCgalTransformFromJsTransform(bTransform),
    false,
    false
  );
  const { average, last, sum } = endTime(timer);
  logInfo(
    'algorithm/cgal/differenceOfSurfaceMeshes',
    `${last} (${sum}) [${average}]`
  );
  return result;
};

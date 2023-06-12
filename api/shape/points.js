import { eachPoint, taggedPoints } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const points = Shape.registerMethod2(
  'points',
  ['inputGeometry'],
  (geometry) => {
    const points = [];
    eachPoint(geometry, ([x = 0, y = 0, z = 0, exact]) =>
      points.push([x, y, z, exact])
    );
    return Shape.fromGeometry(taggedPoints({}, points));
  }
);

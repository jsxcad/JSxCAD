import { eachPoint, taggedPoints } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const points = Shape.chainable(() => (shape) => {
  const points = [];
  eachPoint(
    Shape.toShape(shape, shape).toGeometry(),
    ([x = 0, y = 0, z = 0, exact]) => points.push([x, y, z, exact])
  );
  return Shape.fromGeometry(taggedPoints({}, points));
});

Shape.registerMethod('points', points);

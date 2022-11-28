import { eachPoint, taggedPoints } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const points = Shape.registerMethod('points', () => async (shape) => {
  const points = [];
  eachPoint(await shape.toGeometry(), ([x = 0, y = 0, z = 0, exact]) =>
    points.push([x, y, z, exact])
  );
  return Shape.fromGeometry(taggedPoints({}, points));
});

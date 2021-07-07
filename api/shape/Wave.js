import { concatenatePath, translatePath } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { seq } from '@jsxcad/api-v1-math';

export const Wave = (
  toPathFromXDistance = (xDistance) => [[0]],
  { from, by, to, upto, downto } = {}
) => {
  let path = [null];
  for (const xDistance of seq((distance) => distance, {
    from,
    by,
    to,
    upto,
    downto,
  })) {
    const subpath = toPathFromXDistance(xDistance);
    path = concatenatePath(path, translatePath([xDistance, 0, 0], subpath));
  }
  return Shape.fromPath(path);
};

export default Wave;

Shape.prototype.Wave = Shape.shapeMethod(Wave);

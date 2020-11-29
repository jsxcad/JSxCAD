import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { concatenate, translate } from '@jsxcad/geometry-path';

import { numbers } from '@jsxcad/api-v1-math';

export const Wave = (
  toPathFromXDistance = (xDistance) => [[0]],
  { from = 0, to = 360, by, resolution } = {}
) => {
  if (by === undefined && resolution === undefined) {
    by = 1;
  }
  let path = [null];
  for (const xDistance of numbers((distance) => distance, { from, to, by })) {
    const subpath = toPathFromXDistance(xDistance);
    path = concatenate(path, translate([xDistance, 0, 0], subpath));
  }
  return Shape.fromPath(path);
};

export default Wave;

Shape.prototype.Wave = shapeMethod(Wave);

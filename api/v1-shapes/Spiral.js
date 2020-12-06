import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { concatenate, rotateZ } from '@jsxcad/geometry-path';

import { numbers } from '@jsxcad/api-v1-math';

export const Spiral = (
  toPathFromAngle = (angle) => [[angle]],
  { from = 0, to, upto, by, resolution } = {}
) => {
  if (by === undefined && resolution === undefined) {
    by = 1;
  }
  if (to === undefined && upto === undefined) {
    to = 360;
  }
  let path = [null];
  for (const angle of numbers((angle) => angle, {
    from,
    to,
    upto,
    by,
    resolution,
  })) {
    const radians = (angle * Math.PI) / 180;
    const subpath = toPathFromAngle(angle);
    path = concatenate(path, rotateZ(radians, subpath));
  }
  return Shape.fromPath(path);
};

export default Spiral;

Shape.prototype.Spiral = shapeMethod(Spiral);

import { concatenate, rotateZ } from '@jsxcad/geometry-path';

import Shape from '@jsxcad/api-v1-shape';
import { numbers } from '@jsxcad/api-v1-math';

/**
 *
 * # Spiral
 *
 * These take a function mapping angle to radius.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Spiral(angle => [angle],
 *        { to: 360 * 5 });
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Spiral({ to: 360 },
 *        (angle) => [[2 + sin(angle * 20)]])
 *   .close()
 *   .interior()
 * ```
 * :::
 **/

export const Spiral = (
  toPathFromAngle = (angle) => [[angle]],
  { from = 0, to = 360, by, resolution } = {}
) => {
  if (by === undefined && resolution === undefined) {
    by = 1;
  }
  let path = [null];
  for (const angle of numbers((angle) => angle, { from, to, by, resolution })) {
    const radians = (angle * Math.PI) / 180;
    const subpath = toPathFromAngle(angle);
    path = concatenate(path, rotateZ(radians, subpath));
  }
  return Shape.fromPath(path);
};

export default Spiral;

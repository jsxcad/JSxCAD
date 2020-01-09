import { concatenate, translate } from '@jsxcad/geometry-path';

import Shape from '@jsxcad/api-v1-shape';
import { numbers } from '@jsxcad/api-v1-math';

/**
 *
 * # Wave
 *
 * These take a function mapping X distance to Y distance.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Wave(angle => [[sin(angle) * 100]],
 *      { to: 360 });
 * ```
 * :::
 **/

export const Wave = (toPathFromXDistance = (xDistance) => [0], { from = 0, to = 360, by = 1 } = {}) => {
  let path = [null];
  for (const xDistance of numbers(distance => distance, { from, to, by })) {
    const subpath = toPathFromXDistance(xDistance);
    path = concatenate(path, translate([xDistance, 0, 0], subpath));
  }
  return Shape.fromPath(path);
};

export default Wave;

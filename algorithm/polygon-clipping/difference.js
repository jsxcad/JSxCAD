import { fromSurface, toSurface } from './convert';

import { doesNotOverlap } from './doesNotOverlap';
import polygonClipping from 'polygon-clipping';

/**
 * Return a surface representing the difference between the first surface
 *   and the rest of the surfaces.
 * The difference of no surfaces is the empty surface.
 * The difference of one surface is that surface.
 * @param {Array<surface>} surfaces - the surfaces.
 * @returns {surface} - the resulting surface
 * @example
 * let C = difference(A, B)
 * @example
 * +-------+            +-------+
 * |       |            |   C   |
 * |   A   |            |       |
 * |    +--+----+   =   |    +--+
 * +----+--+    |       +----+
 *      |   B   |
 *      |       |
 *      +-------+
 */
export const difference = (minuend, ...subtrahends) => {
  if (minuend.length === 0) {
    return [];
  }
  if (subtrahends.length === 0) {
    return minuend;
  }
  while (subtrahends.length > 0) {
    const subtrahend = subtrahends.pop();
    if (doesNotOverlap(minuend, subtrahend)) {
      continue;
    }
    minuend = toSurface(
      polygonClipping.difference(fromSurface(minuend), fromSurface(subtrahend))
    );
  }
  return minuend;
};

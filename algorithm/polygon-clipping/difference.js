import { clean, fromSurface, toSurface } from './convert';

import { assertGood } from '@jsxcad/geometry-surface';
import { createNormalize2 } from './createNormalize2';
import { doesNotOverlap } from '@jsxcad/geometry-z0surface';
import polygonClipping from 'polygon-clipping';
import { unionClipping } from './union';

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
  const normalize2 = createNormalize2();
  const subtrahend = unionClipping(normalize2, subtrahends.map(subtrahend => fromSurface(normalize2, subtrahend)));
  const result = differenceClipping(normalize2, fromSurface(normalize2, minuend), subtrahend);
  const surface = toSurface(normalize2, result);
  assertGood(surface);
  return surface;
};

export const differenceClipping = (normalize2, minuend, subtrahend) => {
  const result = polygonClipping.difference(minuend, subtrahend);
  const cleaned = clean(normalize2, result);
  return cleaned;
}

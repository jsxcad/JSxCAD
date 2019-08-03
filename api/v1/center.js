import { add, negate, scale } from '@jsxcad/math-vec3';

import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { translate } from './translate';

/**
 *
 * # Center
 *
 * Moves the shape so that it is centered on the origin.
 *
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * Cube({ corner1: [30, -30, 10],
 *        corner2: [10, -10, 0] })
 * ```
 * :::
 * ::: illustration { "view": { "position": [100, 100, 100] } }
 * ```
 * Cube({ corner1: [30, -30, 10],
 *        corner2: [10, -10, 0] })
 *   .center()
 * ```
 * :::
 **/

export const center = (shape) => {
  const [minPoint, maxPoint] = measureBoundingBox(shape);
  let center = scale(0.5, add(minPoint, maxPoint));
  return translate(negate(center), shape);
};

const method = function () { return center(this); };

Shape.prototype.center = method;

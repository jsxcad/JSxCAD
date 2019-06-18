import { add, scale } from '@jsxcad/math-vec3';

import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';

/**
 *
 * # Measure Center
 *
 * Provides the center of the smallest orthogonal box containing the shape.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * sphere(7)
 * ```
 * :::
 **/

export const measureCenter = (shape) => {
  const [high, low] = measureBoundingBox(shape);
  return scale(0.5, add(high, low));
};

const method = function () { return measureCenter(this); };

Shape.prototype.measureCenter = method;

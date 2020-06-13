import { add, scale } from '@jsxcad/math-vec3';

import Shape from './Shape';
import { measureBoundingBox } from './measureBoundingBox';

/**
 *
 * # Measure Center
 *
 * Provides the center of the smallest orthogonal box containing the shape.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Sphere(7)
 * ```
 * :::
 **/

export const measureCenter = (shape) => {
  // FIX: Produce a clearer definition of center.
  const geometry = shape.toKeptGeometry();
  if (geometry.plan && geometry.plan.connector) {
    // Return the center of the connector.
    return geometry.marks[0];
  }
  const [high, low] = measureBoundingBox(shape);
  return scale(0.5, add(high, low));
};

const measureCenterMethod = function () {
  return measureCenter(this);
};
Shape.prototype.measureCenter = measureCenterMethod;

measureCenter.signature = 'measureCenter(shape:Shape) -> vector';
measureCenterMethod.signature = 'Shape -> measureCenter() -> vector';

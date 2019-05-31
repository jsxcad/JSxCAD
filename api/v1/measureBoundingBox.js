import { max, min } from '@jsxcad/math-vec3';

import { Shape } from './Shape';

/**
 *
 * # Measure Bounding Box
 *
 * Provides the corners of the smallest orthogonal box containing the shape.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * sphere(7)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * const [corner1, corner2] = sphere(7).measureBoundingBox();
 * cube({ corner1, corner2 })
 * ```
 * :::
 **/

export const measureBoundingBox = (shape) => {
  // FIX: Handle empty geometries.
  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];
  let empty = true;
  shape.eachPoint({},
                  (point) => {
                    minPoint = min(minPoint, point);
                    maxPoint = max(maxPoint, point);
                    empty = false;
                  });
  if (empty) {
    return [[0, 0, 0], [0, 0, 0]];
  } else {
    return [minPoint, maxPoint];
  }
};

const method = function () { return measureBoundingBox(this); };

Shape.prototype.measureBoundingBox = method;

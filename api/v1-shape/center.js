import { add, negate, scale } from '@jsxcad/math-vec3';

import Shape from './Shape.js';
import measureBoundingBox from './measureBoundingBox.js';

/**
 *
 * # Center
 *
 * Moves the shape so that its bounding box is centered on the origin.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Circle(20).with(Cube(10).center())
 * ```
 * :::
 **/

const X = 0;
const Y = 1;
const Z = 2;

export const center = (
  shape,
  { centerX = true, centerY = true, centerZ = true } = {}
) => {
  const [minPoint, maxPoint] = measureBoundingBox(shape);
  const center = scale(0.5, add(minPoint, maxPoint));
  if (!centerX) {
    center[X] = 0;
  }
  if (!centerY) {
    center[Y] = 0;
  }
  if (!centerZ) {
    center[Z] = 0;
  }
  // FIX: Find a more principled way to handle centering empty shapes.
  if (isNaN(center[X]) || isNaN(center[Y]) || isNaN(center[Z])) {
    return shape;
  }
  const moved = shape.move(...negate(center));
  return moved;
};

const centerMethod = function (...params) {
  return center(this, ...params);
};
Shape.prototype.center = centerMethod;

export default center;

import { add, negate, scale } from "@jsxcad/math-vec3";

import Shape from "./Shape";
import measureBoundingBox from "./measureBoundingBox";

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

export const center = (shape) => {
  const [minPoint, maxPoint] = measureBoundingBox(shape);
  let center = scale(0.5, add(minPoint, maxPoint));
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

center.signature = "center(shape:Shape) -> Shape";
centerMethod.signature = "Shape -> center() -> Shape";

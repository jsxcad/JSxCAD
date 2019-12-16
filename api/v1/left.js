import { Shape } from './Shape';
import { measureBoundingBox } from './measureBoundingBox';
import { moveX } from './moveX';

/**
 *
 * # Left
 *
 * Moves the shape so that it is just to the left of the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cube(10).left(),
 *          Cylinder(2, 15))
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).left(Sphere(5))
 * ```
 * :::
 **/

const X = 0;

export const left = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return moveX(shape, -maxPoint[X]);
};

const leftMethod = function (...args) { return left(this, ...args); };
Shape.prototype.left = leftMethod;

left.signature = 'left(shape:Shape) -> Shape';
leftMethod.signature = 'Shape -> left() -> Shape';

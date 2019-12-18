import Shape from './Shape';
import measureBoundingBox from './measureBoundingBox';
import moveX from './moveX';

/**
 *
 * # Right
 *
 * Moves the shape so that it is just to the right of the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cube(10).right(),
 *          Cylinder(2, 15))
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).right(Sphere(5))
 * ```
 * :::
 **/

const X = 0;

export const right = (shape) => {
  const [minPoint] = measureBoundingBox(shape);
  return moveX(shape, -minPoint[X]);
};

const rightMethod = function (...args) { return right(this, ...args); };
Shape.prototype.right = rightMethod;

right.signature = 'right(shape:Shape) -> Shape';
rightMethod.signature = 'Shape -> right() -> Shape';

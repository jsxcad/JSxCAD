import Shape from './Shape';
import measureBoundingBox from './measureBoundingBox';
import moveY from './moveY';

/**
 *
 * # Front
 *
 * Moves the shape so that it is just before the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * assemble(Cylinder(2, 15).translate([0, 0, 2.5]),
 *          Cube(10).front())
 * ```
 * :::
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cube(10).front(Sphere(5))
 * ```
 * :::
 **/

const Y = 1;

export const front = (shape) => {
  const [, maxPoint] = measureBoundingBox(shape);
  return moveY(shape, -maxPoint[Y]);
};

const frontMethod = function (...args) { return front(this, ...args); };
Shape.prototype.front = frontMethod;

frontMethod.signature = 'Shape -> front() -> Shape';

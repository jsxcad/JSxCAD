import Shape from './Shape';
import assemble from './assemble';
import measureBoundingBox from './measureBoundingBox';
import moveY from './moveY';

/**
 *
 * # Back
 *
 * Moves the shape so that it is just behind the origin.
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * Cylinder(2, 15)
 *   .with(Cube(10).back())
 * ```
 * :::
 **/

const MIN = 0;
const Y = 1;

export const back = (shape, reference) => {
  return moveY(shape, -measureBoundingBox(shape)[MIN][Y]);
};

const backMethod = function (...params) { return back(this, ...params); };
Shape.prototype.back = backMethod;

export default back;

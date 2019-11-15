import Shape from './Shape';
import measureBoundingBox from './measureBoundingBox';
import moveZ from './moveZ';

/**
 *
 * # Below
 *
 * Moves the shape so that its highest point is at z = 0.
 *
 * ::: illustration { "view": { "position": [60, -60, -60], "target": [0, 0, 0] } }
 * ```
 * Circle(20).flip().with(Cube(10).below())
 * ```
 * :::
 **/

const MAX = 1;
const Z = 2;

export const below = (shape, reference) => {
  return moveZ(shape, -measureBoundingBox(shape)[MAX][Z]);
};

const belowMethod = function (...params) { return below(this, ...params); };
Shape.prototype.below = belowMethod;

export default below;

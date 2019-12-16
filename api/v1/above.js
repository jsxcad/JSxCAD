import Shape from './Shape';
import measureBoundingBox from './measureBoundingBox';
import moveZ from './moveZ';

/**
 *
 * # Above
 *
 * Moves the shape so that its lowest point is at z = 0.
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Circle(20).with(Cube(10).above())
 * ```
 * :::
 **/

const MIN = 0;
const Z = 2;

export const above = (shape) => {
  return moveZ(shape, -measureBoundingBox(shape)[MIN][Z]);
};

const aboveMethod = function (...params) { return above(this, ...params); };
Shape.prototype.above = aboveMethod;

above.signature = 'above(shape:Shape) -> Shape';
aboveMethod.signature = 'Shape -> above() -> Shape';

export default above;

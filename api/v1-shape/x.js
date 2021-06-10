import Shape from './Shape.js';
import move from './move.js';

/**
 *
 * # MoveX
 *
 * Move along the X axis.
 *
 */

export const moveX = (shape, ...x) =>
  Shape.Group(...x.map((x) => move(shape, x)));

const moveXMethod = function (...x) {
  return moveX(this, ...x);
};
Shape.prototype.x = moveXMethod;

export default moveX;

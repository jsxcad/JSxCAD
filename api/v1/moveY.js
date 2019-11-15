import Shape from './Shape';
import move from './move';

/**
 *
 * # MoveY
 *
 * Move along the Y axis.
 *
 */

export const moveY = (shape, y) => move(shape, 0, y);

const method = function (y) { return moveY(this, y); };
Shape.prototype.moveY = method;

export default moveY;

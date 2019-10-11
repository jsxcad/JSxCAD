import { Shape } from './Shape';
import { move } from './move';

/**
 *
 * # MoveY
 *
 * Move along the Y axis.
 *
 */

export const moveY = (y, shape) => move(0, y, shape);

const method = function (y) { return moveY(y, this); };
Shape.prototype.moveY = method;

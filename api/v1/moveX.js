import { Shape } from './Shape';
import { move } from './move';

/**
 *
 * # MoveX
 *
 * Move along the X axis.
 *
 */

export const moveX = (x, shape) => move(x, shape);

const method = function (x) { return moveX(x, this); };
Shape.prototype.moveX = method;

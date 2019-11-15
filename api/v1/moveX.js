import { Shape } from './Shape';
import { move } from './move';

/**
 *
 * # MoveX
 *
 * Move along the X axis.
 *
 */

export const moveX = (shape, x) => move(shape, x);

const method = function (x) { return moveX(this, x); };
Shape.prototype.moveX = method;

import Shape from './Shape';
import move from './move';

/**
 *
 * # MoveY
 *
 * Move along the Y axis.
 *
 */

export const moveY = (shape, y = 0) => move(shape, 0, y);

const moveYMethod = function (y) { return moveY(this, y); };
Shape.prototype.moveY = moveYMethod;

export default moveY;

moveY.signature = 'moveY(shape:Shape, y:number = 0) -> Shape';
moveYMethod.signature = 'Shape -> moveY(y:number = 0) -> Shape';

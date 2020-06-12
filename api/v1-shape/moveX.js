import Shape from "./Shape";
import move from "./move";

/**
 *
 * # MoveX
 *
 * Move along the X axis.
 *
 */

export const moveX = (shape, x = 0) => move(shape, x);

const moveXMethod = function (x) {
  return moveX(this, x);
};
Shape.prototype.moveX = moveXMethod;

export default moveX;

moveX.signature = "moveX(shape:Shape, x:number = 0) -> Shape";
moveXMethod.signature = "Shape -> moveX(x:number = 0) -> Shape";

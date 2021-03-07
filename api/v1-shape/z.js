import Shape from './Shape.js';
import move from './move.js';

/**
 *
 * # MoveZ
 *
 * Move along the Z axis.
 *
 */

export const moveZ = (shape, z = 0) => move(shape, 0, 0, z);

const moveZMethod = function (z) {
  return moveZ(this, z);
};
Shape.prototype.z = moveZMethod;

export default moveZ;

import Shape from './Shape';
import move from './move';

/**
 *
 * # MoveZ
 *
 * Move along the Z axis.
 *
 */

export const moveZ = (shape, z) => move(shape, 0, 0, z);

const method = function (z) { return moveZ(this, z); };
Shape.prototype.moveZ = method;

export default moveZ;

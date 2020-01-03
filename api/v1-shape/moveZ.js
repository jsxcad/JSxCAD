import Shape from './Shape';
import move from './move';

/**
 *
 * # MoveZ
 *
 * Move along the Z axis.
 *
 */

export const moveZ = (shape, z = 0) => move(shape, 0, 0, z);

const moveZMethod = function (z) { return moveZ(this, z); };
Shape.prototype.moveZ = moveZMethod;

export default moveZ;

moveZ.signature = 'moveZ(shape:Shape, z:number = 0) -> Shape';
moveZMethod.signature = 'Shape -> moveZ(z:number = 0) -> Shape';

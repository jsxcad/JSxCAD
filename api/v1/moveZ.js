import { Shape } from './Shape';
import { move } from './move';

/**
 *
 * # MoveZ
 *
 * Move along the Z axis.
 *
 */

export const moveZ = (z, shape) => move(0, 0, z, shape);

const method = function (z) { return moveZ(z, this); };
Shape.prototype.moveZ = method;

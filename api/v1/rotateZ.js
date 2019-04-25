import { Assembly } from './Assembly';
import { Paths } from './Paths';
import { Solid } from './Solid';
import { Surface } from './Solid';

import { fromZRotation } from '@jsxcad/math-mat4';

export const rotateZ = (angle, shape) => shape.transform(fromZRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateZ(angle, this); };

Assembly.prototype.rotateZ = method;
Path2D.prototype.rotateZ = method;
Solid.prototype.rotateZ = method;
Surface.prototype.rotateZ = method;

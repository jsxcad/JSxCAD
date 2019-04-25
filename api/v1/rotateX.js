import { Assembly } from './Assembly';
import { Paths } from './Paths';
import { Solid } from './Solid';
import { Surface } from './Surface';

import { fromXRotation } from '@jsxcad/math-mat4';

export const rotateX = (angle, shape) => shape.transform(fromXRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateX(angle, this); };

Assembly.prototype.rotateX = method;
Path2D.prototype.rotateX = method;
Solid.prototype.rotateX = method;
Surface.prototype.rotateX = method;

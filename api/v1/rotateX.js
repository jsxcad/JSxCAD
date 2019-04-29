import { Assembly } from './Assembly';
import { Paths } from './Paths';
import { Solid } from './Solid';
import { Z0Surface } from './Z0Surface';

import { fromXRotation } from '@jsxcad/math-mat4';

export const rotateX = (angle, shape) => shape.transform(fromXRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateX(angle, this); };

Assembly.prototype.rotateX = method;
Paths.prototype.rotateX = method;
Solid.prototype.rotateX = method;
Z0Surface.prototype.rotateX = method;

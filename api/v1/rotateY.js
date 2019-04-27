import { Assembly } from './Assembly';
import { Z0Surface } from './Z0Surface';
import { Solid } from './Solid';
import { Paths } from './Paths';

import { fromYRotation } from '@jsxcad/math-mat4';

export const rotateY = (angle, shape) => shape.transform(fromYRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateY(angle, this); };

Assembly.prototype.rotateY = method;
Paths.prototype.rotateY = method;
Solid.prototype.rotateY = method;
Z0Surface.prototype.rotateY = method;

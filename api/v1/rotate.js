import { fromXRotation, fromYRotation, fromZRotation, multiply } from '@jsxcad/math-mat4';

import { Assembly } from './Assembly';
import { Z0Surface } from './Z0Surface';
import { Solid } from './Solid';
import { Paths } from './Paths';

const a2r = (angle) => angle * 0.017453292519943295;

export const rotate = ([x = 0, y = 0, z = 0], shape) =>
  shape.transform(multiply(fromZRotation(a2r(z)), multiply(fromYRotation(a2r(y)), fromXRotation(a2r(x)))));

const method = function (angles) { return rotate(angles, this); };

Assembly.prototype.rotate = method;
Paths.prototype.rotate = method;
Solid.prototype.rotate = method;
Z0Surface.prototype.rotate = method;

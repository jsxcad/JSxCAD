import { fromXRotation, fromYRotation, fromZRotation, multiply } from '@jsxcad/math-mat4';

import { Shape } from './Shape';

const a2r = (angle) => angle * 0.017453292519943295;

export const rotate = ([x = 0, y = 0, z = 0], shape) =>
  shape.transform(multiply(fromZRotation(a2r(z)), multiply(fromYRotation(a2r(y)), fromXRotation(a2r(x)))));

const method = function (angles) { return rotate(angles, this); };

Shape.prototype.rotate = method;

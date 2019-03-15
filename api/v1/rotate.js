import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { Path2D } from './Path2D';
import { fromXRotation, fromYRotation, fromZRotation, multiply } from '@jsxcad/math-mat4';

const a2r = (angle) => angle * 0.017453292519943295;

export const rotate = ([x = 0, y = 0, z = 0], shape) =>
  shape.transform(multiply(fromZRotation(a2r(z)), multiply(fromYRotation(a2r(y)), fromXRotation(a2r(x)))));

const method = function (angles) { return rotate(angles, this); };

Assembly.prototype.rotate = method;
CAG.prototype.rotate = method;
CSG.prototype.rotate = method;
Path2D.prototype.rotate = method;

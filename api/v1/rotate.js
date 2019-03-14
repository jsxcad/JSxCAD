import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { fromXRotation, fromYRotation, fromZRotation, multiply } from '@jsxcad/math-mat4';

export const rotate = ([x = 0, y = 0, z = 0], shape) => shape.transform(multiply(fromZRotation(y), multiply(fromYRotation(y), fromXRotation(x))));

const method = function (angles) { return rotate(angles, this); }

Assembly.prototype.rotate = method;
CAG.prototype.rotate = method;
CSG.prototype.rotate = method;

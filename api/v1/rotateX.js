import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { fromXRotation } from '@jsxcad/math-mat4';

export const rotateX = (angle, shape) => shape.transform(fromXRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateX(angle, this); }

Assembly.prototype.rotateX = method;
CAG.prototype.rotateX = method;
CSG.prototype.rotateX = method;

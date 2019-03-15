import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { Path2D } from './Path2D';
import { fromYRotation } from '@jsxcad/math-mat4';

export const rotateY = (angle, shape) => shape.transform(fromYRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateY(angle, this); }

Assembly.prototype.rotateY = method;
CAG.prototype.rotateY = method;
CSG.prototype.rotateY = method;
Path2D.prototype.rotateY = method;

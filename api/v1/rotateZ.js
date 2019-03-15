import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { Path2D } from './Path2D';
import { fromZRotation } from '@jsxcad/math-mat4';

export const rotateZ = (angle, shape) => shape.transform(fromZRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateZ(angle, this); }

Assembly.prototype.rotateZ = method;
CAG.prototype.rotateZ = method;
CSG.prototype.rotateZ = method;
Path2D.prototype.rotateZ = method;

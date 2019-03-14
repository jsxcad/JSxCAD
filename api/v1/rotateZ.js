import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { fromZRotation } from '@jsxcad/math-mat4';

export const rotateZ = (angle, shape) => {
console.log(`QQ/rotateZ/angle: ${angle}`);
  return shape.transform(fromZRotation(angle * 0.017453292519943295));
}

const method = function (angle) { console.log(`QQ/rotateZ/method/angle: ${angle}`); return rotateZ(angle, this); }

Assembly.prototype.rotateZ = method;
CAG.prototype.rotateZ = method;
CSG.prototype.rotateZ = method;

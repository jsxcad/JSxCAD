import { Shape } from './Shape';
import { fromZRotation } from '@jsxcad/math-mat4';

export const rotateZ = (angle, shape) => shape.transform(fromZRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateZ(angle, this); };

Shape.prototype.rotateZ = method;

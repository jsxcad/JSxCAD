import { Shape } from './Shape';
import { fromXRotation } from '@jsxcad/math-mat4';

export const rotateX = (angle, shape) => shape.transform(fromXRotation(angle * 0.017453292519943295));

const method = function (angle) { return rotateX(angle, this); };

Shape.prototype.rotateX = method;

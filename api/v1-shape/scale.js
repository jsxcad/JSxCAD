import Shape from './Shape.js';
import { fromScaling } from '@jsxcad/math-mat4';

export const scale = (shape, x = 1, y = x, z = y) =>
  shape.transform(fromScaling([x, y, z]));

const scaleMethod = function (x, y, z) {
  return scale(this, x, y, z);
};
Shape.prototype.scale = scaleMethod;

export default scale;

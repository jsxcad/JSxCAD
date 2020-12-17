import { Shape } from './Shape.js';
// import { fromZRotation } from '@jsxcad/math-mat4';
import { fromRotateZToTransform } from '@jsxcad/algorithm-cgal';

export const rotateZ = (shape, angle) =>
  shape.transform(fromRotateZToTransform(angle));

const rotateZMethod = function (angle) {
  return rotateZ(this, angle);
};
Shape.prototype.rotateZ = rotateZMethod;

export default rotateZ;

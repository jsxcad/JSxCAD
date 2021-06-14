import { Shape } from './Shape.js';
// import { fromZRotation } from '@jsxcad/math-mat4';
import { fromRotateZToTransform } from '@jsxcad/algorithm-cgal';

export const rotateZ = (shape, ...angles) =>
  Shape.Group(...angles.map((angle) => shape.transform(fromRotateZToTransform(angle))));

const rotateZMethod = function (...angles) {
  return rotateZ(this, ...angles);
};
Shape.prototype.rotateZ = rotateZMethod;
Shape.prototype.rz = rotateZMethod;

export default rotateZ;

import { Shape } from './Shape.js';
// import { fromYRotation } from '@jsxcad/math-mat4';
import { fromRotateYToTransform } from '@jsxcad/algorithm-cgal';

export const rotateY = (shape, angle) =>
  shape.transform(fromRotateYToTransform(angle));

const rotateYMethod = function (angle) {
  return rotateY(this, angle);
};
Shape.prototype.rotateY = rotateYMethod;

export default rotateY;

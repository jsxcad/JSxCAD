import { Shape } from './Shape.js';
// import { fromXRotation } from '@jsxcad/math-mat4';
import { fromRotateXToTransform } from '@jsxcad/algorithm-cgal';

export const rotateX = (shape, angle) =>
  shape.transform(fromRotateXToTransform(angle));

const rotateXMethod = function (angle) {
  return rotateX(this, angle);
};
Shape.prototype.rotateX = rotateXMethod;
Shape.prototype.rx = rotateXMethod;

export default rotateX;

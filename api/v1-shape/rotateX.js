import { Shape } from './Shape.js';
// import { fromXRotation } from '@jsxcad/math-mat4';
import { fromRotateXToTransform } from '@jsxcad/algorithm-cgal';

export const rotateX = (shape, ...angles) =>
  Shape.Group(
    ...angles.map((angle) => shape.transform(fromRotateXToTransform(angle)))
  );

const rotateXMethod = function (...angles) {
  return rotateX(this, ...angles);
};
Shape.prototype.rotateX = rotateXMethod;
Shape.prototype.rx = rotateXMethod;

export default rotateX;

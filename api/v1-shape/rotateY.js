import { Shape } from './Shape.js';
// import { fromYRotation } from '@jsxcad/math-mat4';
import { fromRotateYToTransform } from '@jsxcad/algorithm-cgal';

export const rotateY = (shape, ...angles) =>
  Shape.Group(
    ...angles.map((angle) => shape.transform(fromRotateYToTransform(angle)))
  );

const rotateYMethod = function (...angles) {
  return rotateY(this, ...angles);
};
Shape.prototype.rotateY = rotateYMethod;
Shape.prototype.ry = rotateYMethod;

export default rotateY;

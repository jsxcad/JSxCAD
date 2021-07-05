import { Shape } from './Shape.js';
// import { fromZRotation } from '@jsxcad/math-mat4';
import { fromRotateZToTransform } from '@jsxcad/algorithm-cgal';

export const rotateZ =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) => shape.transform(fromRotateZToTransform(angle)))
    );

export const rz =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) =>
        shape.transform(fromRotateZToTransform(angle * 360))
      )
    );

Shape.registerMethod('rotateZ', rotateZ);
Shape.registerMethod('rz', rz);

export default rotateZ;

import { Shape } from './Shape.js';
import { fromRotateZToTransform } from '@jsxcad/algorithm-cgal';

// rz is in terms of turns -- 1/2 is a half turn.
export const rz =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) =>
        shape.transform(fromRotateZToTransform(angle * 360))
      )
    );

Shape.registerMethod('rz', rz);

export const rotateZ = rz;
Shape.registerMethod('rotateZ', rz);

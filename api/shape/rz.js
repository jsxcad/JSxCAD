import { Shape } from './Shape.js';
import { fromRotateZToTransform } from '@jsxcad/algorithm-cgal';

// rz is in terms of turns -- 1/2 is a half turn.
export const rz =
  (...turns) =>
  (shape) =>
    Shape.Group(
      ...shape
        .toFlatValues(turns)
        .map((turn) => shape.transform(fromRotateZToTransform(turn)))
    );

Shape.registerMethod('rz', rz);

export const rotateZ = rz;
Shape.registerMethod('rotateZ', rz);

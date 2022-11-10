import { Shape } from './Shape.js';
import { fromRotateZToTransform } from '@jsxcad/algorithm-cgal';

// rz is in terms of turns -- 1/2 is a half turn.
export const rz = Shape.registerMethod(
  ['rotateZ', 'rz'],
  (...turns) =>
    (shape) =>
      Shape.Group(
        ...shape
          .toFlatValues(turns)
          .map((turn) => shape.transform(fromRotateZToTransform(turn)))
      )
);

export const rotateZ = rz;

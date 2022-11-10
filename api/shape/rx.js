import { Shape } from './Shape.js';
import { fromRotateXToTransform } from '@jsxcad/algorithm-cgal';

// rx is in terms of turns -- 1/2 is a half turn.
export const rx = Shape.registerMethod(
  ['rotateX', 'rx'],
  (...turns) =>
    (shape) =>
      Shape.Group(
        ...shape
          .toFlatValues(turns)
          .map((turn) => shape.transform(fromRotateXToTransform(turn)))
      )
);

export const rotateX = rx;

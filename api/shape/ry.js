import { Shape } from './Shape.js';
import { fromRotateYToTransform } from '@jsxcad/algorithm-cgal';

// ry is in terms of turns -- 1/2 is a half turn.
export const ry = Shape.chainable(
  (...turns) =>
    (shape) =>
      Shape.Group(
        ...shape
          .toFlatValues(turns)
          .map((turn) => shape.transform(fromRotateYToTransform(turn)))
      )
);

Shape.registerMethod('ry', ry);

export const rotateY = ry;
Shape.registerMethod('rotateY', ry);

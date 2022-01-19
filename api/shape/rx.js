import { Shape } from './Shape.js';
import { fromRotateXToTransform } from '@jsxcad/algorithm-cgal';

// rx is in terms of turns -- 1/2 is a half turn.
export const rx =
  (...turns) =>
  (shape) =>
    Shape.Group(
      ...shape
        .toFlatValues(turns)
        .map((turn) => shape.transform(fromRotateXToTransform(turn)))
    );

Shape.registerMethod('rx', rx);

export const rotateX = rx;
Shape.registerMethod('rotateX', rotateX);

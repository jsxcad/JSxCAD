import { Shape } from './Shape.js';
import { fromRotateXToTransform } from '@jsxcad/algorithm-cgal';

// rx is in terms of turns -- 1/2 is a half turn.
export const rx =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...shape
        .toFlatValues(angles)
        .map((angle) => shape.transform(fromRotateXToTransform(angle * 360)))
    );

Shape.registerMethod('rx', rx);

export const rotateX = rx;
Shape.registerMethod('rotateX', rotateX);

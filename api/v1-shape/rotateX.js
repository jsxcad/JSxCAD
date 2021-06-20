import { Shape } from './Shape.js';
import { fromRotateXToTransform } from '@jsxcad/algorithm-cgal';

export const rotateX = (shape, ...angles) =>
  Shape.Group(
    ...angles.map((angle) => shape.transform(fromRotateXToTransform(angle)))
  );

// rx is in terms of turns -- 1/2 is a half turn.
export const rx = (shape, ...angles) =>
  Shape.Group(
    ...angles.map((angle) =>
      shape.transform(fromRotateXToTransform(angle * 360))
    )
  );

Shape.registerMethod('rotateX', rotateX);
Shape.registerMethod('rx', rx);

export default rotateX;

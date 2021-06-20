import { Shape } from './Shape.js';
import { fromRotateYToTransform } from '@jsxcad/algorithm-cgal';

export const rotateY = (shape, ...angles) =>
  Shape.Group(
    ...angles.map((angle) => shape.transform(fromRotateYToTransform(angle)))
  );

// ry is in terms of turns -- 1/2 is a half turn.
export const ry = (shape, ...angles) =>
  Shape.Group(
    ...angles.map((angle) =>
      shape.transform(fromRotateYToTransform(angle * 360))
    )
  );

Shape.registerMethod('rotateY', rotateY);
Shape.registerMethod('ry', ry);

export default rotateY;

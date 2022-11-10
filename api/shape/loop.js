import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const Loop = Shape.registerShapeMethod('Loop', (...shapes) =>
  Shape.fromGeometry(
    loftGeometry(
      shapes.map((shape) => shape.toGeometry()),
      /* closed= */ false
    )
  )
);

export default Loop;

export const loop = Shape.registerMethod(
  'loop',
  (...shapes) =>
    (shape) =>
      Loop(shape, ...shape.toShapes(shapes))
);

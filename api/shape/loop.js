import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const Loop = Shape.registerShapeMethod('Loop', async (...shapes) =>
  Shape.fromGeometry(
    loftGeometry(
      await Shape.toShapesGeometries(shapes),
      /* closed= */ false
    )
  )
);

export default Loop;

export const loop = Shape.registerMethod(
  'loop',
  (...shapes) =>
    async (shape) =>
      Loop(shape, ...await shape.toShapes(shapes))
);

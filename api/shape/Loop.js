import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const Loop = Shape.registerShapeMethod('Loop', async (...shapes) =>
  Shape.fromGeometry(
    linkGeometry(
      await Shape.toShapesGeometries(shapes),
      /* close= */ true
    )
  ));

export default Loop;

export const loop = Shape.registerMethod('loop',
  (...shapes) =>
    (shape) =>
      Loop(shape, ...shape.toShapes(shapes, shape)));

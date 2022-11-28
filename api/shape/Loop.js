import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';
import { toShapesGeometries } from './toShapesGeometries.js';

export const Loop = Shape.registerShapeMethod('Loop', async (...shapes) =>
  Shape.fromGeometry(
    linkGeometry(await toShapesGeometries(shapes)(null), /* close= */ true)
  )
);

export default Loop;

export const loop = Shape.registerMethod(
  'loop',
  (...shapes) =>
    async (shape) =>
      Loop(shape, ...(await shape.toShapes(shapes)))
);

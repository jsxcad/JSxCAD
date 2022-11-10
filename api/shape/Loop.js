import './toShapesGeometries.js';

import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

const toShapesGeometriesOp = Shape.ops.get('toShapesGeometries');

export const Loop = Shape.registerShapeMethod('Loop', async (...shapes) =>
  Shape.fromGeometry(
    linkGeometry(await toShapesGeometriesOp(shapes)(null), /* close= */ true)
  )
);

export default Loop;

export const loop = Shape.registerMethod(
  'loop',
  (...shapes) =>
    async (shape) =>
      Loop(shape, ...(await shape.toShapes(shapes)))
);

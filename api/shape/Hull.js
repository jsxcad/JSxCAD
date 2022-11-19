import Shape from './Shape.js';
import { convexHull } from '@jsxcad/geometry';
import { toShapesGeometries } from './toShapesGeometries.js';

export const Hull = Shape.registerShapeMethod('Hull', async (...shapes) =>
  Shape.fromGeometry(
    convexHull(await toShapesGeometries(shapes)(null))
  )
);

export const hull = Shape.registerMethod(
  'hull',
  (...shapes) =>
    async (shape) =>
      Hull(...await shape.toShapes(shapes))
);

export default Hull;

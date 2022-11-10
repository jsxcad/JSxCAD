import './toShapes.js';

import Shape from './Shape.js';

const toShapesOp = Shape.ops.get('toShapes');

export const toShapesGeometries = Shape.registerMethod('toShapesGeometries', (value) => async (shape) => {
  const shapes = await toShapesOp(value)(shape);
  const settledShapes = await Promise.allSettled(shapes);
  return settledShapes.map((shape) => {
    return shape.value.toGeometry();
  });
});

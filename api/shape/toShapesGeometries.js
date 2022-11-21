import './toShapes.js';

import Shape from './Shape.js';

const toShapesOp = Shape.ops.get('toShapes');

export const toShapesGeometries = Shape.registerMethod(
  'toShapesGeometries',
  (value) => async (shape) => {
    const shapes = await toShapesOp(value)(shape);
    const geometries = [];
    for (const shape of shapes) {
      geometries.push(await shape.toGeometry());
    }
    return geometries;
  }
);

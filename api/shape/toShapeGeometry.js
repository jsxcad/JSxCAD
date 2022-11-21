import './toShapes.js';

import Shape from './Shape.js';

const toShapeOp = Shape.ops.get('toShape');

export const toShapeGeometry = Shape.registerMethod(
  'toShapeGeometry',
  (value) => async (shape) => {
    const valueShape = await toShapeOp(value)(shape);
    return valueShape.toGeometry();
  }
);

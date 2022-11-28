import Shape from './Shape.js';
import { toShape } from './toShape.js';

export const toShapeGeometry = Shape.registerMethod(
  'toShapeGeometry',
  (value) => async (shape) => {
    const valueShape = await toShape(value)(shape);
    return valueShape.toGeometry();
  }
);

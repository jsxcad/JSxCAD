import Shape from './Shape.js';
import { eagerTransform as eagerTransformGeometry } from '@jsxcad/geometry';

export const eagerTransform = Shape.registerMethod(
  'eagerTransform',
  (matrix) => async (shape) =>
    Shape.fromGeometry(eagerTransformGeometry(matrix, await shape.toGeometry()))
);

export default eagerTransform;

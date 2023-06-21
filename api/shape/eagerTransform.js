import Shape from './Shape.js';
import { eagerTransform as eagerTransformGeometry } from '@jsxcad/geometry';

export const eagerTransform = Shape.registerMethod2(
  'eagerTransform',
  ['inputGeometry', 'value'],
  (geometry, matrix) =>
    Shape.fromGeometry(eagerTransformGeometry(matrix, geometry))
);

export default eagerTransform;

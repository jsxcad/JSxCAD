import Shape from './Shape.js';
import { and as andOp } from '@jsxcad/geometry';

export const And = Shape.registerMethod3(
  'And',
  ['geometry', 'geometries'],
  andOp
);

export const and = Shape.registerMethod3(
  'and',
  ['inputGeometry', 'geometries'],
  andOp
);

export default and;

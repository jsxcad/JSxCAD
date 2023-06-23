import Shape from './Shape.js';
import { And as AndOp, and as andOp } from '@jsxcad/geometry';

export const And = Shape.registerMethod3('And', ['geometries'], AndOp);

export const and = Shape.registerMethod3(
  'and',
  ['inputGeometry', 'geometries'],
  andOp
);

export default and;

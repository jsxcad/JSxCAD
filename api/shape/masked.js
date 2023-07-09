import Shape from './Shape.js';
import { masked as op } from '@jsxcad/geometry';

export const masked = Shape.registerMethod3(
  'masked',
  ['inputGeometry', 'geometries'],
  op
);

export default masked;

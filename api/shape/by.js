import Shape from './Shape.js';
import { by as op } from '@jsxcad/geometry';

export const by = Shape.registerMethod3(
  'by',
  ['inputGeometry', 'geometries'],
  op
);

export default by;

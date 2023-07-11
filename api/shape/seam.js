import Shape from './Shape.js';
import { seam as op } from '@jsxcad/geometry';

export const seam = Shape.registerMethod3(
  'seam',
  ['inputGeometry', 'geometries'],
  op
);

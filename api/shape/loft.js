import Shape from './Shape.js';
import { loft as loftOp } from '@jsxcad/geometry';

export const Loft = Shape.registerMethod3(
  'Loft',
  ['geometry', 'geometries', 'modes:open'],
  loftOp
);

export const loft = Shape.registerMethod3(
  'loft',
  ['inputGeometry', 'geometries', 'modes:open'],
  loftOp
);

export default Loft;

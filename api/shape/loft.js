import { Loft as LoftOp, loft as loftOp } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Loft = Shape.registerMethod3(
  'Loft',
  ['geometries', 'modes:open'],
  LoftOp,
);

export const loft = Shape.registerMethod3(
  'loft',
  ['inputGeometry', 'geometries', 'modes:open'],
  loftOp,
);

export default Loft;

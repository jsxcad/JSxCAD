import { Ref as RefOp, ref as refOp } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const ref = Shape.registerMethod3(
  'ref',
  [
    'inputGeometry',
    'string',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'coordinate',
  ],
  refOp
);
export const Ref = Shape.registerMethod3(
  'Ref',
  [
    'string',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'coordinate',
  ],
  RefOp
);

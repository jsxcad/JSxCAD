import Shape from './Shape.js';
import { maskedBy as op } from '@jsxcad/geometry';

export const maskedBy = Shape.registerMethod3(
  ['masked', 'maskedBy'],
  ['inputGeometry', 'geometries'],
  op
);

export const MaskedBy = Shape.registerMethod3(
  ['MaskedBy'],
  ['geometries'],
  ([geometry, ...masks]) => op(geometry, masks)
);

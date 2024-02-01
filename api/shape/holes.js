import Shape from './Shape.js';
import { separate as op } from '@jsxcad/geometry';

export const holes = Shape.registerMethod3(
  'holes',
  ['inputGeometry'],
  (geometry) => op(geometry, { noShapes: true, holesAsShapes: true })
);

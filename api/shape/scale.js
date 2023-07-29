import Shape from './Shape.js';

import { scale as op } from '@jsxcad/geometry';

export const scale = Shape.registerMethod3(
  ['scale', 's'],
  ['inputGeometry', 'coordinate', 'number', 'number', 'number'],
  (input, coordinate, dX = 1, dY = dX, dZ = dY) =>
    op(input, coordinate || [dX, dY, dZ])
);

export const s = scale;

import Shape from './Shape.js';
import { scaleToFit as op } from '@jsxcad/geometry';

export const scaleToFit = Shape.registerMethod3(
  ['scaleToFit'],
  ['inputGeometry', 'coordinate', 'number', 'number', 'number'],
  (input, coordinate, dX, dY, dZ) => op(input, coordinate || [dX, dY, dZ])
);

import Shape from './Shape.js';
import { separate as op } from '@jsxcad/geometry';

export const separate = Shape.registerMethod3(
  'separate',
  ['inputGeometry', 'modes:noShapes,noHoles,holesAsShapes'],
  op
);

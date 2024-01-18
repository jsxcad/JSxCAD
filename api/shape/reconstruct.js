import { Shape } from './Shape.js';
import { reconstruct as op } from '@jsxcad/geometry';

// It's not entirely clear that Clip makes sense, but we set it up to clip the first argument for now.
export const reconstruct = Shape.registerMethod3(
  'reconstruct',
  ['inputGeometry', 'options'],
  op
);

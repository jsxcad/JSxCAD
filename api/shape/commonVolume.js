import Shape from './Shape.js';
import { commonVolume as op } from '@jsxcad/geometry';

// The semantics here are not very clear -- this computes a volume that all volumes in the shape have in common.
export const commonVolume = Shape.registerMethod3(
  'commonVolume',
  ['inputGeometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  op
);

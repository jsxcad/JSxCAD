import { Shape } from './Shape.js';
import { clip as clipGeometry } from '@jsxcad/geometry';

// It's not entirely clear that Clip makes sense, but we set it up to clip the first argument for now.
export const Clip = Shape.registerMethod3(
  'Clip',
  ['geometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  clipGeometry
);

export const clip = Shape.registerMethod3(
  'clip',
  ['inputGeometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  clipGeometry
);

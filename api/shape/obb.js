import Shape from './Shape.js';
import { obb as op } from '@jsxcad/geometry';

export const obb = Shape.registerMethod3(
  ['obb', 'orientedBoundingBox'],
  ['inputGeometry'],
  op
);

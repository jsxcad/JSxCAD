import { Fuse, join as joinGeometry } from '@jsxcad/geometry';
import Shape from './Shape.js';

export const Join = Shape.registerMethod3(
  ['Add', 'Fuse', 'Join'],
  ['geometries', 'modes:exact'],
  Fuse
);

export const join = Shape.registerMethod3(
  ['add', 'fuse', 'join'],
  ['inputGeometry', 'geometries', 'modes:exact,noVoid'],
  joinGeometry,
);

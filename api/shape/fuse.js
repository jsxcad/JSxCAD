import { Join } from './join.js';
import Shape from './Shape.js';
import { fuse as op } from '@jsxcad/geometry';

export const Fuse = Join;

export const fuse = Shape.registerMethod3(
  'fuse',
  ['inputGeometry', 'geometries', 'modes:exact'],
  op
);
